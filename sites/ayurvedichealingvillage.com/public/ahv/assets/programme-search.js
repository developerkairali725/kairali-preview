/* Kairali programme finder — vocabulary + matcher. SINGLE SOURCE OF TRUTH for both views.
   Loaded as a plain script by the /ayurvedic-treatments/ desktop and mobile candidate files.
   Optional: assets/fuse.basic.min.js loaded first (ranking nudge only; the matcher works without it).

   STATUS: rebuilt 1 Sep 2026 to Codex's CHANGES verdict. NOT approved for release.
   This search does not diagnose. It routes plain language to governed programme routes and returns a
   result CLASS, so the page can show several options, send the guest to a consultation, or intercept
   with urgent-care guidance instead of selling a programme.
   Rulings applied: phrases stored as phrases; no standalone generic or filler words; no fuzzy matching
   under five characters (an explicit approved-misspelling list covers short diagnoses instead);
   symptom terms that could mean several programmes return several; clinically unsafe or over-claiming
   terms struck and routed to consultation; acute presentations intercepted.
   Review trail: notes/codex-ask-treatments-search-and-shape.md */
(function (root) {
  'use strict';

  var CLASSES = {
    DIRECT: 'DIRECT_MATCH',
    MULTI: 'MULTIPLE_POSSIBLE_MATCHES',
    CONSULT: 'CONSULT_FIRST',
    URGENT: 'URGENT_MEDICAL_HELP',
    NONE: 'OUT_OF_SCOPE',
    DECLINE: 'NOT_TREATED'
  };

  /* ---------------------------------------------------------------- normalising
     Fold case, accents, ß and punctuation, then fold the German ae/oe/ue digraphs, so
     "Rückenschmerzen", "rueckenschmerzen", "RUCKENSCHMERZEN" and "ruckenschmerzen" all match.
     Display spellings in the vocabulary below stay correctly accented. */
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function fold(s) { return norm(s).replace(/ue/g, 'u').replace(/oe/g, 'o').replace(/ae/g, 'a'); }

  /* Filler words only, plus the generic words Codex struck from the vocabulary: on their own they
     cannot route a guest anywhere, so they are dropped before scoring and fall through to the
     consultation path. Phrases containing them ("back pain", "mal de dos") are matched intact, earlier. */
  var STOP = new Set(('body own which pain ache aches aching sore hurt hurts painful treatment treatments therapy therapies programme programme programs program health healthy care support chronic best good ayurveda ayurvedic kairali india kerala ' +
    'schmerzen schmerz behandlung therapie gesundheit pflege bestes ' +
    'douleur douleurs traitement therapie sante soins meilleur ' +
    'a about after also always am an and are as at be been but can cannot cant could do does dont for from get had has have help her here his how i if in is it its just like me more much my need no not of on only or over please quite should so some that the their them then there these they this to us very was we what when which who why will with would you your ' +
    'aber alle als also am auch auf aus bei beim bin bis bitte damit das dass dem den der des die diese dir doch du ein eine einen er es etwas fur habe haben hat hier ich ihr im immer in ist ja kann kein keine mein meine mich mir mit nach nicht noch nur oder sehr sein sich sie sind so uber um und viel vielleicht vom von war was weil wenn werden wie wieder wir wird zu zum zur ' +
    'ai alors au aussi aux avec avoir beaucoup bien ce cela ces cette comme dans de des du elle en encore est et etre eux il ils je la le les leur lui ma mais me mes moi mon ne nos notre nous on ou par pas peu peut plus pour quand que quel quelle qui quoi sa sans se ses si son sous sur ta tes toi ton tous tout tres tu un une vos votre vous y').split(' '));

  /* --------------------------------------------------- approved misspellings only
     Replaces unrestricted edit distance for short and important terms. Left side is what the guest
     types; right side is a term that exists in the vocabulary below. */
  var MISSPELL = {
    slep: 'sleep', sleap: 'sleep', sleeep: 'sleep', insomia: 'insomnia', insomnie: 'insomnie',
    bak: 'back', nek: 'neck', neek: 'neck', joynt: 'joint', kneee: 'knee', shoulderpain: 'shoulder',
    diabetis: 'diabetes', diabetese: 'diabetes', diabets: 'diabetes', diabeties: 'diabetes',
    arthritus: 'arthritis', arthiritis: 'arthritis', athritis: 'arthritis', artritis: 'arthritis',
    psoriasus: 'psoriasis', soriasis: 'psoriasis', psorisis: 'psoriasis',
    migrane: 'migraine', migrain: 'migraine', migrenne: 'migraine',
    presure: 'pressure', pressuer: 'pressure', hypertention: 'hypertension',
    spondilitis: 'spondylitis', spondelitis: 'spondylitis', spondylosys: 'spondylosis',
    panchkarma: 'panchakarma', panchakarama: 'panchakarma', pachakarma: 'panchakarma',
    sinusitus: 'sinusitis', sinustis: 'sinusitis',
    ezcema: 'eczema', excema: 'eczema', eksema: 'eczema',
    siatica: 'sciatica', sciatia: 'sciatica', sciatika: 'sciatica',
    obesety: 'obesity', obesitiy: 'obesity',
    paralisis: 'paralysis', paralisys: 'paralysis', paralysys: 'paralysis',
    ruken: 'rucken', rukenschmerzen: 'ruckenschmerzen', ruckenschmerz: 'ruckenschmerzen',
    kopfschmerz: 'kopfschmerzen', gelenkschmerz: 'gelenkschmerzen',
    migrene: 'migrane', schlafstorung: 'schlafstorungen', hautproblem: 'hautprobleme'
  };

  /* ------------------------------------------------------------ urgent intercept
     Matched BEFORE any programme ranking. The page must show urgent-care guidance and no
     programme cards. Sources for the clinical markers are listed in the Codex note. */
  /* Long-standing rehabilitation enquiries are legitimate programme traffic and must NOT be
     intercepted as an acute event. Checked before URGENT. */
  var REHAB_EXEMPT = [
    'i had', 'had a', 'have had', 'i have had', 'history of', 'years ago', 'year ago', 'months ago',
    'month ago', 'weeks ago', 'last year', 'since 20', 'recovering from', 'recovered from', 'ever since',
    'ich hatte', 'vor jahren', 'seit jahren', 'seit dem', 'j ai eu', 'il y a des annees', 'depuis des annees',
    'after stroke', 'post stroke', 'stroke rehabilitation', 'rehabilitation after stroke', 'recovering from a stroke',
    'had a stroke last year', 'years after stroke', 'long standing', 'long term',
    'nach schlaganfall', 'rehabilitation nach schlaganfall', 'apres un avc', 'reeducation apres avc',
    'long standing facial paralysis', 'old facial paralysis'
  ];

  var URGENT = [
    'facial droop', 'face drooping', 'drooping face', 'face has dropped', 'mouth droop',
    'one side of my face', 'side of my face has dropped', 'gesicht hangt', 'haengender mundwinkel',
    'visage affaisse', 'coin de la bouche tombe',
    'slurred speech', 'cannot speak', 'undeutliche sprache', 'troubles de la parole',
    'one sided weakness', 'weakness on one side', 'sudden weakness', 'sudden numbness',
    'plotzliche schwache', 'faiblesse soudaine', 'engourdissement soudain',
    'cannot breathe', 'can t breathe', 'unable to breathe', 'struggling to breathe',
    'severe breathlessness', 'severe shortness of breath', 'gasping for breath',
    'ich kann nicht atmen', 'starke atemnot', 'je n arrive pas a respirer', 'essoufflement severe',
    'chest pain', 'pain in my chest', 'brustschmerzen', 'douleur thoracique',
    'severe withdrawal', 'alcohol withdrawal', 'shaking without alcohol', 'delirium tremens',
    'starke entzugserscheinungen', 'sevrage alcoolique severe',
    'sudden vision loss', 'sudden blurred vision', 'lost sight in one eye',
    'plotzlicher sehverlust', 'perte de vision soudaine'
  ];

  /* --------------------------------------------------------- consultation first
     Real enquiries we can help with, but not by pointing at a governed programme. Either the service
     is not governed, the claim is not approved, or the symptom needs a clinician to place it. */
  var CONSULT = [
    'palpitations', 'heart palpitations', 'herzklopfen', 'palpitations cardiaques',
    'gout', 'gicht', 'goutte',
    'fertility', 'trying for a baby', 'ivf', 'kinderwunsch', 'fertilite',
    'hair fall', 'hair loss', 'losing hair', 'haarausfall', 'perte de cheveux',
    'hearing loss', 'deaf', 'hormone injections', 'surgery', 'operation'
  ];

  /* Conditions Kairali does not treat. Owner ruling, 1 Sep 2026: HIV and AIDS, active communicable
     disease, and cancer itself. Supportive care alongside an oncologist's treatment is a different thing
     and stays available. A named decline is kinder and more useful than a vague dead end. */
  var DECLINE = [
    'hiv', 'aids', 'hiv positive', 'retroviral',
    'tuberculosis', 'active tb', 'tb patient', 'hepatitis b', 'hepatitis c', 'covid', 'corona',
    'measles', 'chicken pox', 'typhoid', 'dengue', 'contagious', 'infectious disease', 'communicable disease',
    'cure my cancer', 'cure cancer', 'treat my cancer', 'treat cancer', 'cancer cure', 'chemotherapy instead',
    'instead of chemotherapy', 'alternative to chemotherapy', 'krebs heilen', 'guerir le cancer',
    'tuberkulose', 'ansteckend', 'infektionskrankheit', 'maladie contagieuse'
  ];

  /* Conditions the hospital does treat, where the card must carry a qualifier rather than be hidden. */
  var CAVEAT = {
    '/revitalizing-and-strengthening/': 'We do not treat cancer itself. Our doctors provide supportive care alongside your oncologist’s treatment — they will tell you what is possible at consultation.',
    '/womens-hormonal-balance-endocrine-therapy/': 'Endocrine and hormonal care. An Ayurvedic doctor confirms at consultation whether it suits your diagnosis.',
    '/treatment-for-hypertension/': 'Cardiovascular and blood-pressure care. Bring your current prescriptions — our doctors review them with you at consultation.',
    '/post-pregnancy-health-programme/': 'Postnatal care, including feeding and recovery concerns. An Ayurvedic doctor confirms what is appropriate for you.',
    '/treatment-for-paralysis/': 'Rehabilitation rather than acute care. Our doctors confirm at consultation whether this is the right stage for you.',
    '/treatment-for-facial-paralysis/': 'Rehabilitation for long-standing facial paralysis. Our doctors confirm suitability at consultation.',
    '/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/': 'Our doctors assess you before any programme begins, and supervise withdrawal medically.'
  };

  /* ------------------------------------------- symptoms that mean several programmes
     Codex ruling: never force a single route when the symptom is genuinely ambiguous. */
  var GENERIC = [
    { term: 'detox', routes: ['/panchakarma-therapy/', '/holistic-treatment-for-rejuvenation-and-detoxification/', '/preventive-and-regenerative-treatment/'] },
    { term: 'detoxification', routes: ['/panchakarma-therapy/', '/holistic-treatment-for-rejuvenation-and-detoxification/', '/preventive-and-regenerative-treatment/'] },
    { term: 'entgiftung', routes: ['/panchakarma-therapy/', '/holistic-treatment-for-rejuvenation-and-detoxification/', '/preventive-and-regenerative-treatment/'] },
    { term: 'back pain', routes: ['/treatment-for-chronic-back-pain/', '/treatment-for-slip-disc/', '/treatment-for-spondylitis/'] },
    { term: 'stress', routes: ['/treatment-to-remove-stress-and-strain/', '/yoga-based-stress-energy-reset-program/'] },
    { term: 'skin problem', routes: ['/treatment-for-skin-diseases/', '/treatment-for-psoriasis/'] },
    { term: 'skin problems', routes: ['/treatment-for-skin-diseases/', '/treatment-for-psoriasis/'] },
    { term: 'hautprobleme', routes: ['/treatment-for-skin-diseases/', '/treatment-for-psoriasis/'] },
    { term: 'problemes de peau', routes: ['/treatment-for-skin-diseases/', '/treatment-for-psoriasis/'] },
    { term: 'yoga', routes: ['/yoga-and-meditation-package/', '/yoga-retreats/', '/yoga-meditation-training/'] },
    { term: 'pain', routes: ['/treatment-for-chronic-back-pain/', '/treatment-for-arthritis-and-spondylitis/', '/treatment-for-cervical-spondylosis/', '/treatment-for-slip-disc/'] },
    { term: 'schmerzen', routes: ['/treatment-for-chronic-back-pain/', '/treatment-for-arthritis-and-spondylitis/', '/treatment-for-cervical-spondylosis/'] },
    { term: 'douleur', routes: ['/treatment-for-chronic-back-pain/', '/treatment-for-arthritis-and-spondylitis/', '/treatment-for-cervical-spondylosis/'] },
    { term: 'ruckenschmerzen', routes: ['/treatment-for-chronic-back-pain/', '/treatment-for-slip-disc/', '/treatment-for-spondylitis/'] },
    { term: 'mal de dos', routes: ['/treatment-for-chronic-back-pain/', '/treatment-for-slip-disc/', '/treatment-for-spondylitis/'] },
    { term: 'stiff back', routes: ['/treatment-for-spondylitis/', '/treatment-for-chronic-back-pain/'] },
    { term: 'nerve pain', routes: ['/treatment-for-slip-disc/', '/treatment-for-nervous-disability/'] },
    { term: 'nervenschmerzen', routes: ['/treatment-for-slip-disc/', '/treatment-for-nervous-disability/'] },
    { term: 'shoulder pain', routes: ['/treatment-for-cervical-spondylosis/', '/treatment-for-arthritis-and-spondylitis/'] },
    { term: 'joint pain', routes: ['/treatment-for-arthritis-and-spondylitis/', '/treatment-for-spondylitis/'] }
  ];

  /* --------------------------------------------------------------- the vocabulary
     Multiword entries are matched as PHRASES, never split into independent keywords.
     Single words are matched whole. Under clinical and native DE/FR review. */
  var TERMS = {
    '/panchakarma-therapy/': ['panchakarma', 'classical panchakarma', 'ayurvedic detox', 'detox programme', 'toxin removal', 'vamana', 'virechana', 'basti', 'nasya', 'raktamokshana', 'panchakarma kur', 'entgiftungskur', 'detoxification ayurvedique'],
    '/weight-loss-programme/': ['weight loss', 'lose weight', 'losing weight', 'obesity', 'obese', 'overweight', 'belly fat', 'tummy fat', 'slimming', 'metabolism', 'gewichtsverlust', 'abnehmen', 'übergewicht', 'fettabbau', 'perte de poids', 'obésité', 'maigrir', 'métabolisme'],
    '/holistic-treatment-for-rejuvenation-and-detoxification/': ['rejuvenation', 'anti ageing', 'anti aging', 'vitality', 'run down', 'worn out', 'feeling tired all the time', 'restore energy', 'verjüngung', 'vitalität', 'erschöpfung', 'rajeunissement', 'vitalité', 'fatigue chronique'],
    '/personalized-customized-healing-program/': ['personalised programme', 'personalized program', 'customised programme', 'tailored programme', 'bespoke programme', 'more than one condition', 'several conditions', 'multiple conditions', 'lots of problems', 'not sure which programme', 'not sure what i need', 'individuelles programm', 'maßgeschneidertes programm', 'mehrere beschwerden', 'programme personnalisé', 'sur mesure', 'plusieurs problèmes'],
    '/digestive-wellness-gut-health-yoga-therapy/': ['digestion', 'digestive', 'gut health', 'stomach problems', 'bloating', 'bloated', 'constipation', 'ibs', 'irritable bowel', 'acidity', 'acid reflux', 'indigestion', 'verdauung', 'darmgesundheit', 'blähungen', 'verstopfung', 'digestion difficile', 'ballonnements', 'santé intestinale'],
    '/yoga-based-stress-energy-reset-program/': ['yoga for stress', 'burnout', 'burn out', 'low energy', 'no energy', 'exhausted', 'overworked', 'breathing practice', 'yoga gegen stress', 'energielosigkeit', 'yoga anti stress', 'épuisement', 'manque d énergie'],
    '/immunity-enhancement-executive-health-assessment-therapy/': ['immunity', 'immune system', 'executive health check', 'health assessment', 'frequent infections', 'falling ill often', 'immunsystem', 'abwehrkräfte', 'gesundheitscheck', 'immunité', 'système immunitaire', 'bilan de santé'],
    '/sleep-restoration-therapy/': ['sleep', 'insomnia', 'cannot sleep', 'can t sleep', 'broken sleep', 'waking at night', 'poor sleep', 'sleepless', 'sleeping problems', 'schlafstörungen', 'einschlafprobleme', 'durchschlafprobleme', 'schlaflosigkeit', 'ich kann nicht schlafen', 'troubles du sommeil', 'insomnie', 'réveils nocturnes', 'je ne dors pas'],
    '/womens-hormonal-balance-endocrine-therapy/': ['thyroid', 'thyroid problem', 'underactive thyroid', 'overactive thyroid', 'hypothyroid', 'hyperthyroid', 'schilddruse', 'schilddrusenunterfunktion', 'thyroide', 'endocrine', 'hormonal balance', 'hormone imbalance', 'hormonal problems', 'menopause', 'perimenopause', 'hot flushes', 'hot flashes', 'pcos', 'pcod', 'irregular periods', 'painful periods', 'hormonelles gleichgewicht', 'wechseljahre', 'hitzewallungen', 'unregelmäßige periode', 'équilibre hormonal', 'ménopause', 'bouffées de chaleur', 'règles irrégulières'],
    '/preventive-and-regenerative-treatment/': ['preventive treatment', 'prevention', 'stay healthy', 'regenerative treatment', 'annual detox', 'yearly programme', 'vorbeugende behandlung', 'prävention', 'regeneration', 'traitement préventif', 'prévention', 'régénération'],
    '/treatment-for-diabetes/': ['diabetes', 'diabetic', 'type 2 diabetes', 'prediabetes', 'blood sugar', 'high blood sugar', 'sugar levels', 'hba1c', 'insulin resistance', 'blutzucker', 'zuckerkrank', 'insulinresistenz', 'diabète', 'glycémie', 'sucre dans le sang'],
    '/yoga-meditation-training/': ['yoga teacher training', 'become a yoga teacher', 'yoga certification', 'ttc', 'meditation course', 'yogalehrer ausbildung', 'meditationskurs', 'formation professeur de yoga', 'cours de méditation'],
    '/ayurveda-training-programs/': ['ayurveda course', 'learn ayurveda', 'study ayurveda', 'therapist training', 'panchakarma therapist training', 'ayurveda diploma', 'ayurveda certification', 'ayurveda ausbildung', 'therapeutenausbildung', 'ayurveda diplom', 'formation ayurveda', 'diplôme ayurveda'],
    '/yoga-retreats/': ['yoga retreat', 'yoga holiday', 'short break', 'time out', 'getaway', 'yoga urlaub', 'auszeit', 'kurzreise', 'retraite de yoga', 'séjour bien être'],
    '/yoga-and-meditation-package/': ['yoga and meditation', 'meditation', 'pranayama', 'mindfulness', 'breathing exercises', 'daily practice', 'calm mind', 'yoga und meditation', 'achtsamkeit', 'atemübungen', 'yoga et méditation', 'pleine conscience', 'exercices de respiration'],
    '/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/': ['withdrawal', 'entzug', 'entwohnung', 'sevrage', 'addiction', 'addicted', 'alcohol problem', 'drinking problem', 'stop drinking', 'give up alcohol', 'drugs', 'drug problem', 'quit smoking', 'stop smoking', 'tobacco', 'cigarettes', 'rehabilitation', 'dependency', 'sucht', 'abhängigkeit', 'alkoholproblem', 'rauchen aufhören', 'drogen', 'entwöhnung', 'dépendance', 'arrêter de fumer', 'problème d alcool', 'drogue'],
    '/treatment-for-sinusitis-and-migraine/': ['sinusitis', 'sinus problems', 'blocked nose', 'stuffy nose', 'nasal congestion', 'migraine', 'migraines', 'headache', 'headaches', 'nebenhöhlenentzündung', 'verstopfte nase', 'migräne', 'kopfschmerzen', 'sinusite', 'nez bouché', 'maux de tête', 'céphalées'],
    '/treatment-for-bronchial-diseases/': ['asthma', 'bronchitis', 'wheezing', 'chronic cough', 'coughing', 'breathing problems', 'respiratory problems', 'husten', 'atemwege', 'atembeschwerden', 'asthme', 'bronchite', 'toux', 'voies respiratoires'],
    '/beauty-care-and-eye-care/': ['eye care', 'eyesight', 'vision', 'dry eyes', 'tired eyes', 'eye strain', 'screen fatigue', 'augenpflege', 'sehkraft', 'trockene augen', 'augenbelastung', 'soins des yeux', 'vue', 'sécheresse oculaire', 'fatigue des yeux'],
    '/treatment-to-remove-stress-and-strain/': ['stress', 'anxiety', 'anxious', 'worry', 'tension', 'mental health', 'overwhelmed', 'cannot switch off', 'relaxation', 'shirodhara', 'angst', 'sorgen', 'anspannung', 'entspannung', 'überforderung', 'anxiété', 'inquiétude', 'détente'],
    '/treatment-for-hypertension/': ['cholesterol', 'high cholesterol', 'circulation', 'poor circulation', 'heart health', 'cardiovascular', 'herzgesundheit', 'sante cardiaque', 'high blood pressure', 'blood pressure', 'hypertension', 'bluthochdruck', 'hoher blutdruck', 'hypertonie', 'tension artérielle'],
    '/treatment-for-nervous-disability/': ['numbness', 'weakness in legs', 'weakness in arms', 'taubheit', 'engourdissement', 'nerve problems', 'nervous system', 'neurological', 'neuropathy', 'numbness in hands', 'tingling', 'pins and needles', 'tremor', 'multiple sclerosis', 'nervensystem', 'neurologisch', 'taubheitsgefühl', 'kribbeln', 'zittern', 'système nerveux', 'neuropathie', 'engourdissement', 'fourmillements', 'tremblements'],
    '/revitalizing-and-strengthening/': ['cancer', 'krebs', 'chemotherapy', 'chemotherapie', 'chimiotherapie', 'radiotherapy', 'oncology', 'support during cancer treatment', 'supportive care during chemotherapy', 'after chemotherapy', 'radiotherapy support', 'oncology supportive care', 'begleitende therapie bei krebs', 'nach der chemotherapie', 'soins de support pendant le cancer', 'après la chimiothérapie'],
    '/treatment-for-slip-disc/': ['slipped disc', 'slip disc', 'herniated disc', 'disc prolapse', 'sciatica', 'trapped nerve', 'shooting leg pain', 'lumbar disc', 'bandscheibenvorfall', 'ischias', 'hernie discale', 'sciatique'],
    '/treatment-for-arthritis-and-spondylitis/': ['arthritis', 'knee', 'knees', 'hip', 'hips', 'knee pain', 'hip pain', 'swollen joints', 'stiff joints', 'rheumatoid arthritis', 'rheumatism', 'osteoarthritis', 'gelenkschmerzen', 'knieschmerzen', 'rheuma', 'steife gelenke', 'arthrite', 'douleur au genou', 'rhumatisme'],
    '/treatment-for-chronic-back-pain/': ['chronic back pain', 'lower back pain', 'backache', 'lumbago', 'bad back', 'long standing back pain', 'kreuzschmerzen', 'lendenschmerzen', 'lombalgie', 'douleur dorsale', 'mal de dos chronique'],
    '/post-pregnancy-health-programme/': ['breastfeeding', 'lactation', 'milk supply', 'not enough milk', 'c section recovery', 'caesarean recovery', 'stillen', 'milchbildung', 'allaitement', 'post pregnancy', 'postpartum', 'after birth', 'after delivery', 'new mother', 'baby weight', 'postnatal recovery', 'nach der geburt', 'wochenbett', 'rückbildung', 'après l accouchement', 'post partum', 'récupération après accouchement'],
    '/treatment-for-skin-diseases/': ['skin problems', 'eczema', 'dermatitis', 'rash', 'itching', 'itchy skin', 'acne', 'pimples', 'dry skin', 'pigmentation', 'hautprobleme', 'ekzem', 'ausschlag', 'juckreiz', 'akne', 'trockene haut', 'problèmes de peau', 'eczéma', 'éruption', 'démangeaisons', 'acné', 'peau sèche'],
    '/treatment-for-facial-paralysis/': ['facial paralysis', 'bells palsy', 'facial nerve', 'long standing facial paralysis', 'gesichtslähmung', 'fazialisparese', 'paralysie faciale', 'nerf facial'],
    '/treatment-for-paralysis/': ['paralysis', 'stroke', 'schlaganfall', 'avc', 'one sided weakness', 'weakness on one side', 'half body weakness', 'cannot walk', 'difficulty walking', 'kann nicht gehen', 'ne peut plus marcher', 'after stroke', 'post stroke rehabilitation', 'stroke rehabilitation', 'hemiplegia', 'loss of movement', 'mobility rehabilitation', 'physiotherapy after stroke', 'lähmung', 'nach schlaganfall', 'halbseitenlähmung', 'rehabilitation nach schlaganfall', 'paralysie', 'après un avc', 'hémiplégie', 'rééducation'],
    '/treatment-for-cervical-spondylosis/': ['neck', 'nacken', 'neck pain', 'stiff neck', 'cervical spondylosis', 'cervical spine', 'neck and shoulder pain', 'upper back pain', 'computer neck', 'nackenschmerzen', 'steifer nacken', 'halswirbelsäule', 'douleur cervicale', 'nuque raide', 'haut du dos'],
    '/treatment-for-spondylitis/': ['spondylitis', 'ankylosing spondylitis', 'spine stiffness', 'morning stiffness', 'sacroiliac', 'wirbelsäule', 'morgensteifigkeit', 'rückensteifheit', 'spondylite', 'colonne vertébrale', 'raideur matinale'],
    '/treatment-for-psoriasis/': ['psoriasis', 'scaly skin', 'flaky skin', 'silvery scales', 'scalp psoriasis', 'flare up', 'schuppenflechte', 'schuppige haut', 'kopfhaut psoriasis', 'peau squameuse', 'cuir chevelu']
  };

  /* ------------------------------------------------------------------- matching */
  function pad(s) { return ' ' + s + ' '; }
  function hasPhrase(q, phrase) { return pad(q).indexOf(pad(fold(phrase))) >= 0; }
  function firstPhrase(q, list) {
    for (var i = 0; i < list.length; i++) if (hasPhrase(q, list[i])) return list[i];
    return null;
  }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var prev = [], i, j, row;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      row = [i];
      for (j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = row;
    }
    return prev[b.length];
  }

  function createSearch(cfg) {
    var programmes = cfg.programmes || [];
    var aliases = cfg.aliases || {};
    var host = cfg.host || '';
    var FuseCtor = cfg.Fuse || root.Fuse;
    var idx = null, fuse = null;

    function build() {
      if (idx) return idx;
      idx = programmes.map(function (p) {
        var key = p.h.replace(host, '');
        var entries = (TERMS[key] || []).map(fold);
        return {
          h: p.h, key: key,
          titleWords: fold(p.t).split(' ').filter(function (w) { return w.length > 2 && !STOP.has(w); }),
          aliasWords: fold([(aliases[key] || []).join(' '), p.a, p.s].join(' ')).split(' ').filter(function (w) { return w.length > 2 && !STOP.has(w); }),
          phrases: entries.filter(function (e) { return e.indexOf(' ') >= 0; }),
          words: entries.filter(function (e) { return e.indexOf(' ') < 0; })
        };
      });
      if (typeof FuseCtor !== 'undefined' && FuseCtor) {
        fuse = new FuseCtor(idx.map(function (d) {
          return { h: d.h, blob: d.titleWords.concat(d.words, d.aliasWords).join(' ') };
        }), { includeScore: true, ignoreLocation: true, ignoreFieldNorm: true, threshold: 0.4, minMatchCharLength: 4, keys: ['blob'] });
      }
      return idx;
    }

    // Cost of one query word against one word list. null = no evidence.
    // Fuzzy matching only from five characters up; shorter typos are handled by MISSPELL.
    function wordCost(w, list, base) {
      var best = null, i, v;
      var tol = w.length >= 7 ? 2 : w.length >= 4 ? 1 : 0;
      for (i = 0; i < list.length; i++) {
        v = list[i];
        if (v === w) { if (best === null || base < best) best = base; continue; }
        if (w.length >= 4 && v.indexOf(w) === 0) { if (best === null || base + 0.06 < best) best = base + 0.06; continue; }
        if (tol && v.length >= 4 && Math.abs(v.length - w.length) <= tol &&
            (w.length >= 6 || w.slice(0, 2) === v.slice(0, 2)) && lev(w, v) <= tol) { if (best === null || base + 0.20 < best) best = base + 0.20; }
      }
      return best;
    }

    /* Returns { cls, hits: Map(href -> score) | null, term } .
       hits === null means "no query, show everything".
       Order of decision: rehabilitation exemption, urgent intercept, vocabulary PHRASE,
       ambiguous generic symptom, consultation, then single-word scoring. */
    function query(raw) {
      var qn = norm(raw);
      if (qn.length < 2) return { cls: CLASSES.NONE, hits: null, term: null };
      var q = fold(qn);

      var declined = firstPhrase(q, DECLINE);
      if (declined) return { cls: CLASSES.DECLINE, hits: new Map(), term: declined };
      var acute = firstPhrase(q, REHAB_EXEMPT) ? null : firstPhrase(q, URGENT);

      var words = q.split(' ').filter(function (w) { return w.length > 1 && !STOP.has(w); });
      words = words.map(function (w) { return MISSPELL[w] ? fold(MISSPELL[w]) : w; });
      var qc = words.join(' ');
      var docs = build();
      var i, j;

      // --- vocabulary phrases (the specific case always beats the generic one)
      var phraseHits = [], longest = 0;
      docs.forEach(function (d) {
        var bestLen = 0;
        for (j = 0; j < d.phrases.length; j++) {
          if (hasPhrase(q, d.phrases[j]) || (qc && hasPhrase(qc, d.phrases[j]))) {
            var len = d.phrases[j].split(' ').length;
            if (len > bestLen) bestLen = len;
          }
        }
        if (bestLen) { phraseHits.push({ h: d.h, len: bestLen }); if (bestLen > longest) longest = bestLen; }
      });

      var generic = null;
      for (i = 0; i < GENERIC.length; i++) {
        if (hasPhrase(q, GENERIC[i].term) || (qc && hasPhrase(qc, GENERIC[i].term))) { generic = GENERIC[i]; break; }
      }
      var genericLen = generic ? generic.term.split(' ').length : 0;

      if (!words.length) words = [q];

      // --- single words. Vocabulary words route; programme title and alias words only refine.
      var scored = [];
      docs.forEach(function (d) {
        var hard = null, soft = null, n = 0;
        words.forEach(function (w) {
          var hw = wordCost(w, d.words, 0.06);
          var sw = Math.min(
            wordCost(w, d.titleWords, 0.10) === null ? 9 : wordCost(w, d.titleWords, 0.10),
            wordCost(w, d.aliasWords, 0.18) === null ? 9 : wordCost(w, d.aliasWords, 0.18)
          );
          if (hw !== null) { hard = hard === null ? hw : Math.min(hard, hw); n += 1; }
          else if (sw < 9) { soft = soft === null ? sw : Math.min(soft, sw); n += 1; }
        });
        var best = hard !== null ? hard : soft;
        if (best !== null) scored.push({ h: d.h, score: best - 0.05 * (n - 1), hard: hard !== null });
      });
      scored.sort(function (a2, b2) { return a2.score - b2.score; });

      /* Nobody types in tidy categories. Strong evidence for two or more different programmes in one
         sentence is the comorbidity case the Personalised Programme exists for, so it leads. */
      var strong = [];
      phraseHits.forEach(function (p) { if (strong.indexOf(p.h) < 0) strong.push(p.h); });
      scored.forEach(function (s2) { if (s2.hard && s2.score <= 0.12 && strong.indexOf(s2.h) < 0) strong.push(s2.h); });
      if (generic) {
        var g0 = programmes.filter(function (p) { return p.h.replace(host, '') === generic.routes[0]; })[0];
        if (g0 && strong.indexOf(g0.h) < 0) strong.push(g0.h);
      }
      var joined = / and | also | plus | as well as | und | sowie | et | ainsi que |,/.test(' ' + q + ' ');
      if (strong.length >= 2 && (joined || words.length >= 4)) {
        var pers = programmes.filter(function (p) { return p.h.indexOf('/personalized-customized-healing-program/') >= 0; })[0];
        var cm = new Map();
        if (pers) cm.set(pers.h, -1);
        strong.slice(0, 5).forEach(function (h, n) { if (h !== (pers && pers.h)) cm.set(h, n * 0.01); });
        if (cm.size > 1) return { cls: CLASSES.MULTI, hits: cm, term: 'several conditions' };
      }

      if (longest > genericLen) {
        var top = phraseHits.filter(function (p) { return p.len === longest; });
        var pm = new Map();
        top.forEach(function (p, n) { pm.set(p.h, n * 0.01); });
        return { cls: top.length === 1 ? CLASSES.DIRECT : CLASSES.MULTI, hits: pm, term: null };
      }

      if (generic) {
        var gm = new Map();
        generic.routes.forEach(function (r, n) {
          var f = programmes.filter(function (p) { return p.h.replace(host, '') === r; })[0];
          if (f) gm.set(f.h, n * 0.01);
        });
        if (gm.size) return { cls: CLASSES.MULTI, hits: gm, term: generic.term };
      }


      var consult = firstPhrase(q, CONSULT) || (qc ? firstPhrase(qc, CONSULT) : null);
      var solid = scored.filter(function (s2) { return s2.hard && s2.score <= 0.12; });
      if (consult && !solid.length) return { cls: CLASSES.CONSULT, hits: new Map(), term: consult };

      var keep = scored.filter(function (s2) { return s2.score <= 0.22; }).slice(0, 6);
      if (!keep.length) return { cls: CLASSES.NONE, hits: new Map(), term: null };
      var out = new Map();
      keep.forEach(function (s2) { out.set(s2.h, s2.score); });
      var close = keep.filter(function (s2) { return s2.score - keep[0].score <= 0.05; }).length;
      return { cls: (keep.length === 1 || close === 1) ? CLASSES.DIRECT : CLASSES.MULTI, hits: out, term: null };
    }

    function caveatFor(hrefs) {
      var texts = [];
      (hrefs || []).forEach(function (h) {
        var key = h.replace(host, '');
        if (CAVEAT[key] && texts.indexOf(CAVEAT[key]) < 0) texts.push(CAVEAT[key]);
      });
      return texts;
    }

    /* An acute search still gets its programme results; the page adds a discreet notice above them. */
    function withAcute(raw) {
      var r = query(raw);
      var qf = fold(norm(raw));
      var acute = firstPhrase(qf, REHAB_EXEMPT) ? null : firstPhrase(qf, URGENT);
      if (acute && r.hits) return { cls: CLASSES.URGENT, hits: r.hits, term: acute, inner: r.cls };
      return r;
    }

    return { query: withAcute, classify: query, caveatFor: caveatFor, search: function (raw) { return query(raw).hits; } };
  }

  root.KTAHVSearch = {
    version: '2026-09-01j',
    CLASSES: CLASSES,
    TERMS: TERMS, URGENT: URGENT, REHAB_EXEMPT: REHAB_EXEMPT, DECLINE: DECLINE, CAVEAT: CAVEAT, CONSULT: CONSULT, GENERIC: GENERIC, MISSPELL: MISSPELL,
    STOP: STOP, norm: norm, fold: fold, createSearch: createSearch
  };
})(window);
