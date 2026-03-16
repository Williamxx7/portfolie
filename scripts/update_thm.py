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
        text = soup.get_text(separator="\n")
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        print("Linjer:", lines)

        for i, line in enumerate(lines):
            if "days" in line.lower():
                stats["streak"] = line.strip()
            elif re.match(r'^\[.+\]$', line):
                stats["rank"] = line.strip()

        # Tal uden kontekst — find dem i rækkefølge
        numbers = [l for l in lines if re.match(r'^\d+$', l)]
        print("Tal:", numbers)
        if len(numbers) >= 1:
            stats["rooms"] = numbers[0]   # 15 trophies → brug som rooms
        if len(numbers) >= 2:
            stats["badges"] = numbers[1]  # 9 badges
        if len(numbers) >= 3:
            stats["rooms"] = numbers[2]   # 43 rooms

    except Exception as e:
        print(f"Fejl: {e}")

    return stats

def update_html(stats):
    try:
        with open(HTML_FILE, "r", encoding="utf-8") as f:
            html = f.read()
    except FileNotFoundError:
        print(f"FEJL: Kan ikke finde {HTML_FILE}")
        sys.exit(1)

    replacements = {
        r'id="thm-rank">[^<]*<':   f'id="thm-rank">{stats["rank"]}<',
        r'id="thm-rooms">[^<]*<':  f'id="thm-rooms">{stats["rooms"]}<',
        r'id="thm-badges">[^<]*<': f'id="thm-badges">{stats["badges"]}<',
        r'id="thm-streak">[^<]*<': f'id="thm-streak">{stats["streak"]}<',
    }

    for pattern, replacement in replacements.items():
        html = re.sub(pattern, replacement, html)

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"✅ Opdateret: {stats}")

if __name__ == "__main__":
    print(f"Henter stats for {USERNAME}...")
    stats = fetch_thm_stats()
    print(f"Stats: {stats}")
    update_html(stats)
    sys.exit(0)