import requests
import re
import sys
from bs4 import BeautifulSoup

USERNAME = "r3dp4nda"
USER_ID = "6309351"
HTML_FILE = "projekter.html"

HEADERS = {"User-Agent": "Mozilla/5.0"}

def fetch_thm_stats():
    stats = {"rank": "—", "rooms": "—", "badges": "—", "streak": "—"}

    try:
        res = requests.get(
            f"https://tryhackme.com/api/v2/badges/public-profile?userPublicId={USER_ID}",
            headers=HEADERS,
            timeout=10
        )
        soup = BeautifulSoup(res.text, "html.parser")

        # Find alle tal i badge HTML
        text = soup.get_text()
        print("Badge tekst:", text[:500])

        # Søg efter typiske mønstre
        numbers = re.findall(r'\d+', text)
        print("Tal fundet:", numbers)

    except Exception as e:
        print(f"Fejl: {e}")

    return stats

if __name__ == "__main__":
    stats = fetch_thm_stats()
    print(stats)
    sys.exit(0)