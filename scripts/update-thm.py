import requests
import re

USERNAME = "r3dp4nda"
USER_ID = "6309351"
HTML_FILE = "projekter.html"

def fetch_thm_stats():
    """Hent stats fra TryHackMe's offentlige API endpoints"""
    stats = {
        "rank": "—",
        "rooms": "—",
        "badges": "—",
        "streak": "—"
    }

    try:
        # Profil endpoint
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(
            f"https://tryhackme.com/api/user/rank/{USERNAME}",
            headers=headers,
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            if data.get("success"):
                stats["rank"] = str(data.get("userRank", "—"))

    except Exception as e:
        print(f"Rank fetch fejlede: {e}")

    try:
        # Badge/completion endpoint
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(
            f"https://tryhackme.com/api/no-auth/user/{USERNAME}/badges/count",
            headers=headers,
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            stats["badges"] = str(data.get("badges", "—"))

    except Exception as e:
        print(f"Badge fetch fejlede: {e}")

    try:
        res = requests.get(
            f"https://tryhackme.com/api/no-auth/user/{USERNAME}/completed-rooms/count",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            stats["rooms"] = str(data.get("completed", "—"))

    except Exception as e:
        print(f"Rooms fetch fejlede: {e}")

    try:
        res = requests.get(
            f"https://tryhackme.com/api/no-auth/user/{USERNAME}/streak",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            current = data.get("currentStreak", "—")
            stats["streak"] = f"{current} days" if current != "—" else "—"

    except Exception as e:
        print(f"Streak fetch fejlede: {e}")

    return stats


def update_html(stats):
    """Opdater HTML-filen med nye stats"""
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    replacements = {
        r'id="thm-rank">[^<]*<': f'id="thm-rank">{stats["rank"]}<',
        r'id="thm-rooms">[^<]*<': f'id="thm-rooms">{stats["rooms"]}<',
        r'id="thm-badges">[^<]*<': f'id="thm-badges">{stats["badges"]}<',
        r'id="thm-streak">[^<]*<': f'id="thm-streak">{stats["streak"]}<',
    }

    for pattern, replacement in replacements.items():
        html = re.sub(pattern, replacement, html)

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"✅ HTML opdateret med stats: {stats}")


if __name__ == "__main__":
    print(f"Henter TryHackMe stats for {USERNAME}...")
    stats = fetch_thm_stats()
    print(f"Stats hentet: {stats}")
    update_html(stats)