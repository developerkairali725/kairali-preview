"""Remove stale fixed network counts from published copy; raw audits remain unchanged."""
import re

REPLACEMENTS = {"nine countries": "countries worldwide", "25 centers": "treatment centres", "25 Ayurvedic centres": "Ayurvedic centres"}
def release_copy(value):
    if isinstance(value, str):
        for old, new in REPLACEMENTS.items():
            value = value.replace(old, new)
        return value
    if isinstance(value, list):
        return [release_copy(item) for item in value]
    if isinstance(value, dict):
        return {key: release_copy(item) for key, item in value.items()}
    return value


# MID-15049: Abhilash's 30 September email, Q1-Q13. No replacement clinical claims.
def owner_rulings(pages):
    pages = release_copy(pages)
    claim_sentences = [
        "A full range of traditional treatments is provided to the guests at the resort, and nothing pleases us more than seeing guests solve chronic health problems after a few weeks guidance and dedication from our world-class Ayurveda team.",
        "A full range of traditional treatments is available at the resort, and nothing pleases us more than seeing guests solve chronic health problems after just a few weeks guidance from our world-class Ayurvedic team.",
        "Ayurvedic Medicines are absolutely free from side-effects",
        "The benefits of these ingredients helps one to heal the ailment without any side-effects and give a permanent solution.",
        "Cure your ailments through Ayurveda with No side effects",
        "It has worldwide acceptance for its natural and chemical-free products that gives long-lasting and permanent results.",
        "Kairali is not only a perfect haven to relax, recuperate and detoxify but also is a treatment centre that treats all health-related issues in a natural way.",
        "They help in curing numerous ailments including diabetes, arthritis, respiratory disorders and depression.",
        "Ayurvedic products without any side-effects and chemicals are something that everyone in this present world are searching for.",
        "Ayurveda is a life science dedicated to the importance of food cure, with the cause of disease highly attributed to incorrect diet.",
        "Purely on the basis of Ayurvedic nutrition and ayurvedic cure, one can cleanse and detoxify oneself without causing any ill-effects on the body.",
        "Ayurveda does not aim only towards curing your ailment but an Ayurvedic practitioner’s main aim is to restore the harmony in the body through complete purification.",
        "This Ayurvedic hospital helps patients all over the world to cure their health-related issues with the help of Ayurvedic treatments and therapies.",
        "It is known for its innovative creations and natural solutions to provide products and medicines to cure health issues.",
        "Doctors and physicians from all around the world recommend these Ayurvedic products for their natural ingredients as it helps to cure the diseases in a natural way with permanent results.",
        "Only herbal medicated oils and herbs are used in treatments and massages that have no side effects.",
        "However, as we have already mentioned about the fact that they are chemical-free and also free from side-effects, it can be consumed by anyone, without giving a second thought.",
        "Only medicated oils and herbs are used in treatments and massages that have no side effects.",
        "An epitome of health and wellness, this institution has not only paved the way for a formal Ayurvedic structure to cure illness but has also made it possible for people to realize that the best form of living is to live amidst nature and adapting to natural means of living.",
        "When properly conducted, Ayurveda is a fantastic and proven way to treat one’s body and mind for recovery, cure and a preventative state of health.",
        # MID-15049 medical/legal hold: product efficacy and quantified outcome
        # claims require substantiation just like the explicit cure/no-side-effect
        # promises above. Remove them without inventing replacement claims.
        "Kairali believes in curative remedies by the usage of authentic and natural ingredients.",
        "State- of –art modern equipment’s, professional and up-to-date manufacturing units and the highest standards of quality control allow us to give our retail customers, partners and distributors the most effective and genuine therapeutic medicine.",
        "Best used under the guidance of an Ayurvedic doctor or health professional, these traditional remedies stand the test of time in healing a range of common and everyday health complaints.",
        "Best used under the guidance of an Ayurvedic doctor or health professional, these traditional remedies stand the test of time in healing a range of common health complaints.",
        "Best used under the guidance of an Ayurvedic doctor or health professional, these traditional remedies stand the test of time in healing a range of common and everyday health",
        "Of the vast range of Ayurvedic supplements mentioned in ancient scripture, Kairali offers a selection of seventy-seven, with proven success and a wide application, including curative formulas, immunity boosters and health tonics.",
        "Lipidex enables a gradual weight reduction of 2-4 kg per month, and provides benefits to cardiac health and cholesterol levels.",
        "An effective Ayurvedic liver tonic, ensuring the repair and maintenance of normal functioning of the liver.",
        "Spaliv has proven to be an effective remedy for jaundice, hepatitis, alcoholism and anorexia.",
        "An Ayurvedic product formulated to boost the libido and prevent sexual impotency.",
        "Duravin Forte is a proven aphrodisiac that helps to restore vigour without altering the body’s hormone balance for both male and female.",
        "Durance solves sexual disorders and helps prevent premature ejaculation by acting as a sexual sedative.",
        "An all-natural combination of garlic, herbs and minerals to treat gastric problems and stimulate better digestive functioning, Spazyme boosts digestive enzymes and improves bowel function.",
        "An Ayurvedic treatment shown to significantly reduce cholesterol levels, Spacol also controls and regulates metabolism for healthy blood circulation.",
    ]
    def remove_claims(value):
        if isinstance(value, str):
            for sentence in claim_sentences:
                # Preserve surrounding prose; remove a whole promise even when it contains inline links.
                pattern = re.escape(sentence).replace(r"\ ", r"(?:\s|<[^>]+>)+")
                value = re.sub(pattern, "", value)
            return value
        if isinstance(value, list):
            return [remove_claims(item) for item in value]
        if isinstance(value, dict):
            return {key: (item if key in ("sourceUrl", "sourceSha256") else remove_claims(item)) for key, item in value.items()}
        return value
    pages = remove_claims(pages)
    home = pages.get("/", {})
    for section in home.get("sections", []):
        section["html"] = re.sub(r'<p><a href="/ayurveda-treatment-centres.aspx">The demand for Ayurveda has led to further 24 more centres\.\s*</a></p>', "", section["html"])
    partner = pages.get("/partnerships-and-investment.aspx", {})
    for section in partner.get("sections", []):
        section["html"] = section["html"].replace("established in the year 1997", "established in the year 1999")
    svata = pages.get("/svata-katerina-prague-czech-republic.aspx", {})
    for section in svata.get("sections", []):
        section["html"] = re.sub(r"<table\b[^>]*>.*?</table>", "", section["html"], flags=re.S)
    # MID-15049: Abhilash's 6 October email — careers remain general until HR verifies roles.
    career_html = (
        "<h2>Careers at Kairali</h2>"
        "<p>We welcome general expressions of interest from people who would like to work with Kairali.</p>"
        "<p><strong>Vacancy status is pending HR confirmation.</strong> No individual legacy role is presented as currently open until HR verifies it.</p>"
        "<p>Career applications and CV uploads are inactive while recipient, privacy, retention, storage, scanning and anti-spam controls are reviewed.</p>"
    )
    career_routes = [route for route in pages if route in ("/careers.aspx", "/current-openings.aspx") or route.startswith("/apply-now.aspx")]
    for route in career_routes:
        page = pages[route]
        if route == "/careers.aspx":
            page["title"] = "Careers at Kairali | Kairali Ayurvedic Group"
        elif route == "/current-openings.aspx":
            page["title"] = "Vacancy status | Kairali Ayurvedic Group"
        else:
            page["title"] = "Careers interest | Kairali Ayurvedic Group"
        page["description"] = "Learn about careers at Kairali Ayurvedic Group. Vacancy status is pending HR confirmation; no individual legacy role is presented as currently open."
        page["keywords"] = "Kairali Ayurvedic Group careers, careers interest"
        if page.get("banner"):
            page["banner"]["tagline"] = "Careers at Kairali"
            page["banner"]["h1"] = "Careers and expressions of interest"
            page["banner"]["subtitle"] = ["Vacancy status is pending HR confirmation."]
            page["banner"]["sublinks"] = [{"label": "Careers", "href": None, "current": True}]
        page["sections"] = [{"cls": "generalrepeat", "id": "", "html": career_html, "hidden": False, "form": False}]
    return pages
