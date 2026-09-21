// AHV — Group entity profile family (pharmacy, equipment works, hospitality arm,
// training institute, Villa Raag, Arogya Kendra, Arogya Shala).
// NO LIVE RECORD for these three routes exists in this project (data/records/ holds
// ten unrelated routes only, and live fetch was unavailable). Every body string below
// is STAND-IN copy written to the stated volume so the template can be judged at the
// content extremes. Replace verbatim from the frozen records before porting.
// Head contracts are placeholders. Breadcrumbs provisional from URL hierarchy.
window.AHV_GROUP_ENTITY = {
  family: 'group-entity-profile',
  generated: '2026-09-21',
  site: 'https://ayurvedichealingvillage.com',
  siblings: [
    { label: 'Kairali Ayurvedic Products Pvt. Ltd.', path: '/kairali-ayurvedic-products-pvt-ltd/' },
    { label: 'Kairali Ayurvedic Equipment', path: '/kairali-ayurvedic-equipment/' },
    { label: 'Kairali Hospitality', path: '/kairali-hospitality/' },
    { label: 'Villa Raag', path: '/villa-raag/' },
    { label: 'Kair by Kairali', path: '/kair-by-kairali/' },
    { label: 'Kairali Ayurvedic Centre', path: '/kairali-ayurvedic-centre/' }
  ],
  routes: [

    /* ───────── DESIGN TARGET — 697 words, 4 images, 5 lists, 13 headings, 3 card groups ───────── */
    {
      path: '/kairali-ayurvedic-products-pvt-ltd/',
      mode: 'full',
      volumeNote: '697 words, 4 images, 5 lists, 13 headings and 3 card groups',
      head: {
        title: 'Kairali Ayurvedic Products Pvt. Ltd. | Kairali - The Ayurvedic Healing Village',
        description: '[TO CONFIRM] — replace with the meta description from the frozen record.',
        canonical: 'https://ayurvedichealingvillage.com/kairali-ayurvedic-products-pvt-ltd/',
        robots: 'index, follow'
      },
      crumbs: [
        { label: 'Home', path: '/' },
        { label: 'Kairali Ayurvedic Group', path: '/kairali-ayurvedic-group/' },
        { label: 'Kairali Ayurvedic Products Pvt. Ltd.', path: '/kairali-ayurvedic-products-pvt-ltd/' }
      ],
      h1: 'Kairali Ayurvedic Products Pvt. Ltd.',
      standfirst: 'The manufacturing company of the Kairali group. It formulates and produces classical and proprietary Ayurvedic medicines, herbal powders and oils under its own licence, separately from the hospital.',
      standfirstDraft: true,
      hero: { src: 'assets/img/kairali-group-capules-syrups-propreitary-medicines-01.jpg', alt: 'Capsules, syrups and proprietary Ayurvedic medicines produced by Kairali Ayurvedic Products Pvt. Ltd.' },
      identity: {
        line: 'A licensed Ayurvedic medicine manufacturer, owned by the same family as the hospital and operated as its own company.',
        facts: [
          ['Type of entity', 'Private limited company'],
          ['What it does', 'Manufactures Ayurvedic medicines and herbal preparations'],
          ['Registered name', '[TO CONFIRM]'],
          ['Established', '[TO CONFIRM]'],
          ['Based at', '[TO CONFIRM]'],
          ['Licences held', '[TO CONFIRM]']
        ]
      },
      separation: 'Kairali Ayurvedic Products Pvt. Ltd. is a separate company within the Kairali group. The hospital does not sell or dispatch its products. Orders, trade enquiries and product questions are handled by the company directly, through the contacts below.',
      sections: [
        {
          id: 'what-it-makes', h2: 'What the company makes',
          blocks: [
            { t: 'p', text: 'The company manufactures the preparations used in treatment at the hospital and sold under the Kairali name. Production covers classical formulations prepared to the texts, and proprietary formulations developed in-house and registered under the company\u2019s own licence.' },
            { t: 'p', text: 'Every batch is made to a written formulation record. Raw herbs are received, identified and stored before processing, and finished stock is held under the company\u2019s own quality controls rather than the hospital\u2019s pharmacy stock.' },
            { t: 'cards', heading: 'Product divisions', items: [
              { title: 'Classical medicines', text: 'Kashayams, arishtams, ghritas and thailams prepared to classical method.' },
              { title: 'Proprietary medicines', text: 'Capsules, syrups and tablets registered under the company\u2019s own licence.' },
              { title: 'Herbal preparations', text: 'Powders, oils and packs used in Panchakarma and in daily regimen.' }
            ] },
            { t: 'h3', text: 'Formulation and batch record' },
            { t: 'p', text: 'Formulations are held as controlled documents. A change to a formulation is signed off before it reaches production, and each batch carries its own record from raw material through to finished stock.' },
            { t: 'list', style: 'diamond', items: [
              'Written formulation record per product',
              'Raw material identification on receipt',
              'Batch number carried through to the label',
              'Retained sample held per batch',
              'Finished stock released only after checks'
            ] },
            { t: 'figure', src: 'assets/img/AHV-Knowledge-Products.jpg', alt: 'Finished Ayurvedic preparations in the company\u2019s own packaging.', caption: 'Stand-in image. Replace with the photographs carried on the live route.' }
          ]
        },
        {
          id: 'how-it-is-made', h2: 'How the preparations are made',
          blocks: [
            { t: 'p', text: 'Herbs are cleaned, dried and milled before they enter a preparation. Decoctions are reduced over controlled heat, and oils are processed in stages until the water content is driven off. The sequence follows classical method rather than a shortened industrial one, which is why lead times are measured in weeks.' },
            { t: 'h3', text: 'Sourcing' },
            { t: 'p', text: 'Raw material is bought against a specification for species, part used and place of origin. Material that does not match the specification on arrival is not taken into stock.' },
            { t: 'list', style: 'steps', items: [
              'Specification issued to the supplier',
              'Material identified and sampled on receipt',
              'Quarantine until identification is confirmed',
              'Release into production stock'
            ] },
            { t: 'h3', text: 'Processing' },
            { t: 'p', text: 'Processing areas are separated by preparation type so that powders, oils and liquids do not share equipment. Cleaning between batches is recorded.' },
            { t: 'figure', src: 'assets/img/gal-herbal-powder-massage-wakem.jpg', alt: 'Herbal powder prepared for use in treatment.', caption: 'Stand-in image. Replace with the photographs carried on the live route.' }
          ]
        },
        {
          id: 'quality', h2: 'Quality and testing',
          blocks: [
            { t: 'p', text: 'Testing is carried out on incoming material and on finished stock. Results are held against the batch record, so a finished pack can be traced back to the herbs that went into it.' },
            { t: 'cards', heading: 'Checks at each stage', items: [
              { title: 'On receipt', text: 'Identity, moisture and foreign matter checked before the material is accepted.' },
              { title: 'In process', text: 'Reduction, temperature and duration recorded against the formulation record.' },
              { title: 'On release', text: 'Finished product checked and a retained sample held before dispatch.' }
            ] },
            { t: 'list', style: 'plain', items: [
              'Certifications held: [TO CONFIRM]',
              'Testing laboratory: [TO CONFIRM]',
              'Shelf life stated per product: [TO CONFIRM]'
            ] },
            { t: 'note', text: 'The hospital\u2019s NABH accreditation covers the hospital. It does not extend to this company\u2019s manufacturing, which carries its own licences and certifications.' }
          ]
        },
        {
          id: 'group', h2: 'Where it sits in the group',
          blocks: [
            { t: 'p', text: 'The company supplies the hospital, and it supplies its own trade and retail customers. Those are two separate relationships. A patient admitted for treatment receives preparations as part of a treatment programme prescribed by a physician; a customer buying from the company buys from the company.' },
            { t: 'cards', heading: 'Who deals with what', items: [
              { title: 'The hospital', text: 'Consultation, admission, treatment programmes and discharge advice.' },
              { title: 'This company', text: 'Manufacturing, product orders, trade supply and product questions.' },
              { title: 'Shared', text: 'Ownership, the Kairali name and the family practice behind both.' }
            ] },
            { t: 'figure', src: 'assets/img/AHV-About-Landscape.png', alt: 'The Kairali site at Palakkad.', caption: 'Stand-in image. Replace with the photographs carried on the live route.' }
          ]
        },
        {
          id: 'buying', h2: 'Buying from the company',
          blocks: [
            { t: 'p', text: 'Products are bought from the company, not from the hospital reception. Retail, export and trade enquiries each go to the company\u2019s own contact, listed below.' },
            { t: 'h3', text: 'Before you order' },
            { t: 'list', style: 'diamond', items: [
              'Ayurvedic medicines are prescribed against a diagnosis. Ask a physician before ordering.',
              'Some preparations are restricted for export. Confirm with the company.',
              'Prices, pack sizes and delivery times: [TO CONFIRM]'
            ] },
            { t: 'h3', text: 'If you are a patient' },
            { t: 'p', text: 'Preparations needed during an admission are issued by the hospital pharmacy as part of the treatment programme. Continuing supply after discharge is arranged through the company.' }
          ]
        }
      ],
      entityLink: {
        name: 'Kairali Ayurvedic Products Pvt. Ltd.',
        intro: 'This is a separate company. Product orders, trade supply and manufacturing questions are answered by the company, not by the hospital\u2019s patient care team.',
        actions: [
          { label: 'Company website', href: '[TO CONFIRM]', kind: 'primary' },
          { label: 'Company email', href: '[TO CONFIRM]', kind: 'outline' }
        ],
        fallback: 'If you are not sure which part of the group you need, the group address info@kairali.com will route your message.',
        note: 'The hospital does not take product orders. Treatment enquiries belong in the block below.'
      }
    },

    /* ───────── HIGH EXTREME — 1,048 words, 8 lists ───────── */
    {
      path: '/villa-raag/',
      mode: 'full',
      volumeNote: '1,048 words and 8 lists',
      head: {
        title: 'Villa Raag | Kairali - The Ayurvedic Healing Village',
        description: '[TO CONFIRM] — replace with the meta description from the frozen record.',
        canonical: 'https://ayurvedichealingvillage.com/villa-raag/',
        robots: 'index, follow'
      },
      crumbs: [
        { label: 'Home', path: '/' },
        { label: 'Kairali Ayurvedic Group', path: '/kairali-ayurvedic-group/' },
        { label: 'Villa Raag', path: '/villa-raag/' }
      ],
      h1: 'Villa Raag',
      standfirst: 'The residence set aside for patients who need quiet, extended accommodation during a treatment programme. It is run by the hospitality arm of the group and sits inside the treatment village.',
      standfirstDraft: true,
      hero: { src: 'assets/img/AHV-Classic-Hero.jpg', alt: 'Villa accommodation inside the Kairali treatment village.' },
      identity: {
        line: 'A single residence within the village, kept for patients on longer programmes and for family members staying with them.',
        facts: [
          ['Type of entity', 'Operated by the hospitality arm of the group'],
          ['What it is', 'Accommodation inside the treatment village'],
          ['Rooms', '[TO CONFIRM]'],
          ['Occupancy', '[TO CONFIRM]'],
          ['Tariff', '[TO CONFIRM]'],
          ['Booked through', 'The hospital, as part of a treatment programme']
        ]
      },
      separation: 'Accommodation is arranged by the hospitality arm of the group. Treatment is prescribed and delivered by the hospital. Booking a residence does not admit a patient to a programme, and admission is decided by a physician at consultation.',
      sections: [
        {
          id: 'the-residence', h2: 'The residence',
          blocks: [
            { t: 'p', text: 'Villa Raag stands apart from the main treatment blocks, at the quiet end of the village. It was built for patients whose programmes run for several weeks and who need somewhere settled rather than somewhere temporary. The building is single storey, opens onto its own garden, and is reached on foot from the treatment rooms.' },
            { t: 'p', text: 'The interior is plain. Rooms are arranged so that a patient can rest through the middle of the day without traffic through the space, and so that a family member staying alongside has their own room rather than a folding bed in a shared one.' },
            { t: 'list', style: 'diamond', items: [
              'Single storey, step-free from the path',
              'Own garden and shaded veranda',
              'Separate room for an accompanying family member',
              'Desk and seating for long stays',
              'Walking distance from the treatment rooms'
            ] },
            { t: 'h3', text: 'Layout' },
            { t: 'p', text: 'The plan runs from the veranda through a sitting room to the bedrooms at the rear, with the bathroom reached without crossing the sitting room. Exact room dimensions: [TO CONFIRM].' },
            { t: 'list', style: 'plain', items: [
              'Bedrooms: [TO CONFIRM]',
              'Bathrooms: [TO CONFIRM]',
              'Floor area: [TO CONFIRM]',
              'Distance to the treatment block: [TO CONFIRM]'
            ] },
            { t: 'figure', src: 'assets/img/AHV-Classic-G04.jpg', alt: 'Interior of a villa in the Kairali village.', caption: 'Stand-in image. Replace with the photographs carried on the live route.' }
          ]
        },
        {
          id: 'who-it-is-for', h2: 'Who it is for',
          blocks: [
            { t: 'p', text: 'The residence is allocated by the patient care team once a programme is confirmed. It suits patients whose treatment runs long enough that the room becomes a place to recover in rather than a place to sleep, and patients whose mobility makes stairs or long walks unhelpful.' },
            { t: 'list', style: 'diamond', items: [
              'Patients on programmes of two weeks or longer',
              'Patients travelling with a family member or attendant',
              'Patients who need step-free access throughout',
              'Patients recovering from a condition that makes shared corridors difficult'
            ] },
            { t: 'h3', text: 'Accompanying family members' },
            { t: 'p', text: 'One family member may stay alongside the patient. They eat from the same kitchen and follow the same daily timings, because the timings exist for the treatment rather than for the household.' },
            { t: 'list', style: 'plain', items: [
              'Additional charge for an accompanying person: [TO CONFIRM]',
              'Meals for an accompanying person: [TO CONFIRM]',
              'Children: [TO CONFIRM]'
            ] }
          ]
        },
        {
          id: 'daily-pattern', h2: 'The daily pattern',
          blocks: [
            { t: 'p', text: 'A day in the residence is shaped by the treatment schedule. Therapies are timed against the physician\u2019s prescription, and meals are timed against the therapies, not the other way round. Patients are asked to keep to the schedule, which is the part of the programme people most often underestimate.' },
            { t: 'list', style: 'steps', items: [
              'Morning consultation or observation as prescribed',
              'Therapy session at the treatment block',
              'Rest period in the residence',
              'Diet as prescribed, taken at fixed hours',
              'Second therapy or yoga session where prescribed',
              'Early night; lights out at the stated hour'
            ] },
            { t: 'h3', text: 'Diet' },
            { t: 'p', text: 'Meals are prepared to the diet written into the programme. Substitutions are made by the kitchen only when a physician has approved them, and food brought in from outside is discouraged because it interferes with the treatment.' },
            { t: 'list', style: 'plain', items: [
              'Meals prepared to the prescribed diet',
              'Fixed meal hours tied to therapy timings',
              'Changes approved by a physician, not by request',
              'Outside food discouraged during Panchakarma'
            ] },
            { t: 'figure', src: 'assets/img/AHV-Campaign-organic.jpg', alt: 'Food prepared to a prescribed Ayurvedic diet.', caption: 'Stand-in image. Replace with the photographs carried on the live route.' }
          ]
        },
        {
          id: 'housekeeping', h2: 'Housekeeping and support',
          blocks: [
            { t: 'p', text: 'Housekeeping works around the therapy schedule so that the rooms are serviced while the patient is at treatment. Linen used during oil therapies is handled separately from general laundry.' },
            { t: 'list', style: 'diamond', items: [
              'Rooms serviced during therapy hours',
              'Therapy linen laundered separately',
              'Nursing call point in each room',
              'Attendant support on request from the patient care team'
            ] },
            { t: 'h3', text: 'If a patient needs help at night' },
            { t: 'p', text: 'The call point connects to the nursing station. Response times and on-call cover: [TO CONFIRM].' }
          ]
        },
        {
          id: 'booking', h2: 'How it is booked',
          blocks: [
            { t: 'p', text: 'The residence is not booked on its own. A physician confirms the programme at consultation, and the patient care team then allocates accommodation for the length of that programme. Where the residence is already allocated, the team will offer the nearest equivalent.' },
            { t: 'list', style: 'steps', items: [
              'Consultation with a physician',
              'Programme and length confirmed',
              'Accommodation allocated by the patient care team',
              'Admission date agreed'
            ] },
            { t: 'list', style: 'plain', items: [
              'Tariff: [TO CONFIRM]',
              'Minimum stay: [TO CONFIRM]',
              'Cancellation terms: [TO CONFIRM]',
              'Airport transfer and distance: [TO CONFIRM]'
            ] },
            { t: 'note', text: 'Because accommodation follows the programme, the length of stay is a clinical decision before it is a booking. A shorter stay than prescribed changes what the programme can achieve.' }
          ]
        }
      ],
      entityLink: {
        name: 'Kairali Hospitality',
        intro: 'Accommodation in the village is operated by the hospitality arm of the group. Room questions, tariffs and length of stay are answered there; the treatment itself is arranged by the hospital.',
        actions: [
          { label: 'Hospitality website', href: '[TO CONFIRM]', kind: 'primary' },
          { label: 'Accommodation email', href: '[TO CONFIRM]', kind: 'outline' }
        ],
        fallback: 'If you are not sure which part of the group you need, the group address info@kairali.com will route your message.',
        note: 'A residence cannot be held without a confirmed programme. Start with a consultation below.'
      }
    },

    /* ───────── LOW EXTREME — 228 words ───────── */
    {
      path: '/kair-by-kairali/',
      mode: 'brief',
      volumeNote: 'only 228 words',
      head: {
        title: 'Kair by Kairali | Kairali - The Ayurvedic Healing Village',
        description: '[TO CONFIRM] — replace with the meta description from the frozen record.',
        canonical: 'https://ayurvedichealingvillage.com/kair-by-kairali/',
        robots: 'index, follow'
      },
      crumbs: [
        { label: 'Home', path: '/' },
        { label: 'Kairali Ayurvedic Group', path: '/kairali-ayurvedic-group/' },
        { label: 'Kair by Kairali', path: '/kair-by-kairali/' }
      ],
      h1: 'Kair by Kairali',
      standfirst: 'The group\u2019s hair and skin care line, formulated on Ayurvedic principles and made by the group\u2019s manufacturing company.',
      standfirstDraft: true,
      hero: { src: 'assets/img/AHV-Knowledge-Products.jpg', alt: 'Kairali preparations in retail packaging.' },
      identity: {
        line: 'A consumer product line within the Kairali group, sold direct rather than dispensed at the hospital.',
        facts: [
          ['Type of entity', 'Product line of the group\u2019s manufacturing company'],
          ['What it is', 'Hair and skin preparations'],
          ['Made by', 'Kairali Ayurvedic Products Pvt. Ltd.'],
          ['Launched', '[TO CONFIRM]'],
          ['Where to buy', '[TO CONFIRM]']
        ]
      },
      separation: 'These are retail products, not prescribed medicines. The hospital does not sell them and does not take orders for them. Anything used during a treatment programme is prescribed separately by a physician.',
      sections: [
        {
          id: 'the-range', h2: 'The range',
          blocks: [
            { t: 'p', text: 'The line covers daily hair and skin preparations built on the same formulation practice the group uses for its medicines: named herbs, stated quantities, and a written record behind each batch.' },
            { t: 'list', style: 'diamond', items: [
              'Hair oils and cleansers',
              'Skin preparations for daily use',
              'Pack sizes and prices: [TO CONFIRM]'
            ] }
          ]
        },
        {
          id: 'how-to-buy', h2: 'How to buy',
          blocks: [
            { t: 'p', text: 'The products are bought from the company that makes them. Retail and trade enquiries both go to the company directly, and delivery terms are set by the company rather than by the hospital.' },
            { t: 'note', text: 'If you are being treated at the hospital, ask your physician before adding anything to a prescribed regimen.' }
          ]
        }
      ],
      entityLink: {
        name: 'Kairali Ayurvedic Products Pvt. Ltd.',
        intro: 'Kair by Kairali is made and sold by the group\u2019s manufacturing company. Orders and product questions go to the company.',
        actions: [
          { label: 'Product website', href: '[TO CONFIRM]', kind: 'primary' },
          { label: 'Company email', href: '[TO CONFIRM]', kind: 'outline' }
        ],
        fallback: 'If you are not sure which part of the group you need, the group address info@kairali.com will route your message.',
        note: 'Retail purchase is not a consultation. Treatment enquiries belong in the block below.'
      }
    }
  ]
};
