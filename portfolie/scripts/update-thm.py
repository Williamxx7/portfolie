import requests
import re
import sys

USERNAME = "r3dp4nda"
HTML_FILE = "portfolie/projekter.html"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
}

def safe_get(url):
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"  Fejl ved {url}: {e}")
        return None

def fetch_thm_stats():
    stats = {"rank": "—", "rooms": "—", "badges": "—", "streak": "—"}

    # Rank
    data = safe_get(f"https://tryhackme.com/api/user/rank/{USERNAME}")
    if data and data.get("success"):
        rank = data.get("userRank")
        if rank:
            stats["rank"] = f"#{rank}"

    # Badges
    data = safe_get(f"https://tryhackme.com/api/no-auth/user/{USERNAME}/badges/count")
    if data:
        badges = data.get("badges") or data.get("count")
        if badges is not None:
            stats["badges"] = str(badges)

    # Rooms completed
    data = safe_get(f"https://tryhackme.com/api/no-auth/user/{USERNAME}/completed-rooms/count")
    if data:
        rooms = data.get("completed") or data.get("count")
        if rooms is not None:
            stats["rooms"] = str(rooms)

    # Streak
    data = safe_get(f"https://tryhackme.com/api/no-auth/user/{USERNAME}/streak")
    if data:
        streak = data.get("currentStreak") or data.get("streak")
        if streak is not None:
            stats["streak"] = f"{streak} days"

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
    # Afslut altid med 0 så workflow ikke fejler selvom API returnerer —
    sys.exit(0)