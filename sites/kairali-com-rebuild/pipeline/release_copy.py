"""Remove stale fixed network counts from published copy; raw audits remain unchanged."""
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
