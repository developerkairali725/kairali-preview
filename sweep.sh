#!/usr/bin/env bash
# ============================================================================
# KAIRALI FLEET RECON SWEEP — v1.0 (13 Jul 2026)
# Zero-access external sweep of all group domains. Needs only curl + openssl.
#   bash sweep.sh          → writes sweep_results.csv
# Runs in ~10–15 min. Feed the CSV to Claude Code for RED/AMBER/GREEN triage.
# Read-only: makes GET/HEAD requests only. Touches nothing.
# ============================================================================
set -u
OUT="sweep_results.csv"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 14) KairaliFleetSweep/1.0"
WRONG_PHONE="9289838777"   # must never appear
RIGHT_PHONE="9289838797"   # Priya — should appear on contact surfaces
EMAIL="info@kairali.com"

DOMAINS=(
  arogyakendra.co.in arogyakendra.com arogyashala.co.in arogyashala.in
  ayurvedafranchise.com ayurvedajournals.com ayurvedichealingvillage.com
  balanceglow.com bulkayurvedaoils.com bulkayurvedaproducts.com casaraag.com
  doctorveda.com goawellnessholidays.com healing.recipes healthspacenter.com
  healthspacenters.com houseofayurveda.in kagapp.com kairali.ai kairali.co.in
  kairali.com kairali.guru kairaliayurvedainstitute.com kairalicenter.com
  kairalicenter.in kairalicenters.com kairalicenters.in kairalicentre.com
  kairalicentres.com kairaliequipment.com kairaliequipments.com
  kairalifranchise.com kairaliherbals.com kairalihospitality.com
  kairalioil.com kairalioils.com kairaliorganic.com kairaliorganics.com
  kairalipharma.com kairaliproduct.com kairaliproducts.cn kairaliproducts.com
  kairaliproducts.cz kairaliproducts.in kairaliproducts.us kairalitea.com
  kairalithailand.com kairalitowels.com kairalitraining.com kairalivillage.com
  kairaliyoga.com kairbykairali.com kaircin.com kairorganics.com
  kairproducts.com kappl.co.in keralaayurvedainstitute.com keralacenters.com
  keralacenters.in keralacentre.com keralacentre.in keralacentres.com
  keralacentres.in keralaequipments.com keralaherbals.com keralapharma.com
  keralatowels.com keralatraining.com kiapt.co.in ktahv.com
  livelifeliveyoga.com mobistorr.com rudanti.com sanskritivedic.com
  snehachowdhary.com spaecosystem.com spalabs.in theblushlounge.com
  tourdenight.com traininginayurveda.com trueinstantloan.com
  whatisayurveda.com whatisayurveda.org whyayurveda.com whyayurveda.in
  whyayurveda.org abhilashkr.com
)

csv_escape() { printf '%s' "$1" | tr '\n\r' '  ' | sed 's/"/""/g'; }

echo "domain,dns_resolves,http_status,final_url,https_ok,cert_days_left,server,cms_hint,title,has_viewport,has_analytics,wrong_phone_found,right_phone_found,email_found,last_modified,notes" > "$OUT"

for d in "${DOMAINS[@]}"; do
  echo "→ $d"
  dns="Y"; host "$d" >/dev/null 2>&1 || dns="N"

  status=""; final=""; server=""; lastmod=""; https_ok="N"; cert_days=""
  cms=""; title=""; viewport="N"; analytics="N"; wrongp="N"; rightp="N"; email="N"; notes=""

  if [ "$dns" = "Y" ]; then
    # --- Headers + redirect chain (try https, fall back to http) ---
    hdr=$(curl -sIL -A "$UA" --max-time 20 -o /dev/null \
          -w '%{http_code}|%{url_effective}' "https://$d" 2>/dev/null)
    status="${hdr%%|*}"; final="${hdr#*|}"
    if [ -z "$status" ] || [ "$status" = "000" ]; then
      hdr=$(curl -sIL -A "$UA" --max-time 20 -o /dev/null \
            -w '%{http_code}|%{url_effective}' "http://$d" 2>/dev/null)
      status="${hdr%%|*}"; final="${hdr#*|}"
      notes="https_failed"
    else
      https_ok="Y"
    fi

    # --- Certificate days remaining ---
    if [ "$https_ok" = "Y" ]; then
      exp=$(echo | openssl s_client -servername "$d" -connect "$d:443" 2>/dev/null \
            | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
      if [ -n "${exp:-}" ]; then
        if date -j >/dev/null 2>&1; then  # macOS
          exp_s=$(date -j -f "%b %d %T %Y %Z" "$exp" +%s 2>/dev/null)
        else                               # Linux
          exp_s=$(date -d "$exp" +%s 2>/dev/null)
        fi
        [ -n "${exp_s:-}" ] && cert_days=$(( (exp_s - $(date +%s)) / 86400 ))
      fi
    fi

    # --- Server + Last-Modified headers ---
    heads=$(curl -sI -A "$UA" --max-time 15 "https://$d" 2>/dev/null || \
            curl -sI -A "$UA" --max-time 15 "http://$d" 2>/dev/null)
    server=$(printf '%s' "$heads" | awk -F': ' 'tolower($1)=="server"{print $2; exit}' | tr -d '\r')
    lastmod=$(printf '%s' "$heads" | awk -F': ' 'tolower($1)=="last-modified"{print $2; exit}' | tr -d '\r')

    # --- Body probes (first 400KB is plenty) ---
    body=$(curl -sL -A "$UA" --max-time 30 -r 0-400000 "https://$d" 2>/dev/null || \
           curl -sL -A "$UA" --max-time 30 -r 0-400000 "http://$d" 2>/dev/null)
    if [ -n "$body" ]; then
      lc=$(printf '%s' "$body" | tr '[:upper:]' '[:lower:]')
      title=$(printf '%s' "$body" | sed -n 's:.*<title[^>]*>\(.*\)</title>.*:\1:Ip' | head -1 | cut -c1-120)
      case "$lc" in *wp-content*|*wp-includes*) cms="WordPress";; esac
      [ -z "$cms" ] && case "$lc" in *_next/*) cms="Next.js";; esac
      [ -z "$cms" ] && case "$lc" in *shopify*) cms="Shopify";; esac
      [ -z "$cms" ] && case "$lc" in *joomla*) cms="Joomla";; *frontpage*) cms="FrontPage-era";; esac
      gen=$(printf '%s' "$body" | sed -n 's/.*<meta[^>]*name="generator"[^>]*content="\([^"]*\)".*/\1/Ip' | head -1)
      [ -n "$gen" ] && cms="${cms:+$cms/}$gen"
      case "$lc" in *viewport*) viewport="Y";; esac
      case "$lc" in *"gtag("*|*googletagmanager*|*google-analytics*|*clarity.ms*) analytics="Y";; esac
      flat=$(printf '%s' "$lc" | tr -d ' -()')
      case "$flat" in *"$WRONG_PHONE"*) wrongp="Y";; esac
      case "$flat" in *"$RIGHT_PHONE"*) rightp="Y";; esac
      case "$lc" in *"$EMAIL"*) email="Y";; esac
    else
      notes="${notes:+$notes;}no_body"
    fi
  else
    notes="dns_fail"
  fi

  printf '"%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s"\n' \
    "$(csv_escape "$d")" "$dns" "$(csv_escape "$status")" "$(csv_escape "$final")" \
    "$https_ok" "$(csv_escape "$cert_days")" "$(csv_escape "$server")" "$(csv_escape "$cms")" \
    "$(csv_escape "$title")" "$viewport" "$analytics" "$wrongp" "$rightp" "$email" \
    "$(csv_escape "$lastmod")" "$(csv_escape "$notes")" >> "$OUT"
done

echo ""
echo "Done → $OUT"
echo "Next: give the CSV to Claude Code:"
echo "  \"Triage sweep_results.csv into RED/AMBER/GREEN per PHASE0_STABILIZE_PLAYBOOK Step 0,"
echo "   flag every wrong_phone_found=Y and cert_days_left<30, and re-cut the runbook waves.\""
# Manual follow-ups (Playbook Step 0): curl -sI https://spalabs.in/migration/  +  site:spalabs.in
