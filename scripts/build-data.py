#!/usr/bin/env python3
"""Rebuilds src/data/{perdiem,places,zips,states,vehicles}.json from the official downloads in .cache-raw/.

Downloads (re-run them for an update, then this script):
  GSA  https://www.gsa.gov/system/files/FY2027PerDiemZipCode_Validated090126.xlsx   (FY2027 ZIP file, monthly lodging)
  GSA  https://www.gsa.gov/system/files/FY2026_ZipCodeFile.xlsx
  GSA  https://www.gsa.gov/system/files/FY2027_PerDiemRates_Validated090126.xlsx   (destinations, counties, seasons)
  GSA  https://www.gsa.gov/system/files/FY2026_PerDiemMasterRatesFile.xlsx
  Census https://www2.census.gov/geo/docs/reference/codes2020/national_place_by_county2020.txt
  Census https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv
  EIA  https://www.eia.gov/dnav/pet/xls/PET_PRI_GND_A_EPMR_PTE_DPGAL_W.xls  (gas_reg.xls)
  EIA  https://www.eia.gov/dnav/pet/xls/PET_PRI_GND_A_EPD2D_PTE_DPGAL_W.xls (dsl.xls)
  EIA  https://www.eia.gov/electricity/monthly/xls/table_5_06_b.xlsx        (elec56b.xlsx)
  EPA  https://www.fueleconomy.gov/feg/epadata/vehicles.csv.zip             (vehicles.csv)
"""
import csv, json, os, re, datetime, collections
import openpyxl, xlrd
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, '.cache-raw'); OUT = os.path.join(ROOT, 'src', 'data')
STATES = [('AL','Alabama'),('AZ','Arizona'),('AR','Arkansas'),('CA','California'),('CO','Colorado'),('CT','Connecticut'),('DE','Delaware'),('DC','District of Columbia'),('FL','Florida'),('GA','Georgia'),('ID','Idaho'),('IL','Illinois'),('IN','Indiana'),('IA','Iowa'),('KS','Kansas'),('KY','Kentucky'),('LA','Louisiana'),('ME','Maine'),('MD','Maryland'),('MA','Massachusetts'),('MI','Michigan'),('MN','Minnesota'),('MS','Mississippi'),('MO','Missouri'),('MT','Montana'),('NE','Nebraska'),('NV','Nevada'),('NH','New Hampshire'),('NJ','New Jersey'),('NM','New Mexico'),('NY','New York'),('NC','North Carolina'),('ND','North Dakota'),('OH','Ohio'),('OK','Oklahoma'),('OR','Oregon'),('PA','Pennsylvania'),('RI','Rhode Island'),('SC','South Carolina'),('SD','South Dakota'),('TN','Tennessee'),('TX','Texas'),('UT','Utah'),('VT','Vermont'),('VA','Virginia'),('WA','Washington'),('WV','West Virginia'),('WI','Wisconsin'),('WY','Wyoming')]
NAME = dict(STATES)
PADD = {}
for k, sts in {'1A':'CT ME MA NH RI VT','1B':'DE DC MD NJ NY PA','1C':'FL GA NC SC VA WV','2':'IL IN IA KS KY MI MN MO NE ND SD OH OK TN WI','3':'AL AR LA MS NM TX','4':'CO ID MT UT WY','5':'AZ CA NV OR WA'}.items():
    for s in sts.split(): PADD[s] = k
slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
clean = lambda s: re.sub(r'\s+', ' ', str(s or '')).strip()

# ---------- GSA: destinations with monthly lodging (ZIP files) + county definitions (rates files)
def zipfile_rows(f):
    ws = openpyxl.load_workbook(os.path.join(RAW, f), read_only=True).worksheets[0]
    return list(ws.iter_rows(values_only=True))[1:]
def rates_rows(f, fy):
    ws = openpyxl.load_workbook(os.path.join(RAW, f), read_only=True).worksheets[0]
    out = []
    for r in list(ws.iter_rows(values_only=True))[2:]:
        if fy == 2026: r = r[1:]
        if not r[0]: continue
        out.append(dict(st=clean(r[0]), name=clean(r[1]), counties=clean(r[2]), lodging=r[5], mie=r[6]))
    return out
dest = {}   # key "ST|Name" -> record
zipmap = collections.defaultdict(dict)   # zip -> {fy: key or ''}
standard = {}
for fy, zf, rf in [(2027, 'FY2027PerDiemZipCode_Validated090126.xlsx', 'FY2027_PerDiemRates_Validated090126.xlsx'), (2026, 'FY2026_ZipCodeFile.xlsx', 'FY2026_PerDiemMasterRatesFile.xlsx')]:
    county_def = {}
    for r in rates_rows(rf, fy):
        county_def[(r['st'], r['name'].lower())] = r['counties']
    for r in zipfile_rows(zf):
        did, name, county, locdef, st, z = r[0], clean(r[1]), clean(r[2]), clean(r[3]), clean(r[4]), str(r[5]).zfill(5)
        months = [int(x) for x in r[7:19]]; mie = int(r[19])
        if not did or name.lower() == 'standard rate':
            standard[fy] = {'lodging': months[0], 'mie': mie}
            if not zipmap[z].get(fy): zipmap[z][fy] = ''  # a ZIP split between areas keeps its non-standard area
            continue
        key = f'{st}|{name}'
        d = dest.setdefault(key, {'st': st, 'name': name, 'counties': county_def.get((st, name.lower()), locdef), 'countyNames': collections.Counter(), 'fy': {}})
        if county and fy == 2027 or (county and '2027' not in d['fy']): d['countyNames'][county] += 1
        d['fy'][str(fy)] = {'mie': mie, 'lodging': months}
        if county_def.get((st, name.lower())): d['counties'] = county_def[(st, name.lower())]
        zipmap[z][fy] = key
keys = sorted(dest, key=lambda k: (k.split('|')[0], k.split('|')[1]))
idx = {k: i for i, k in enumerate(keys)}
D = []
for k in keys:
    d = dest[k]
    D.append({'st': d['st'], 'name': d['name'], 'counties': d['counties'], 'slug': slug(d['name']), 'fy': d['fy']})
TIERS = {68: [16, 19, 28, 5], 74: [18, 20, 31, 5], 80: [20, 22, 33, 5], 86: [22, 23, 36, 5], 92: [23, 26, 38, 5]}
for d in D:
    for fy, v in d['fy'].items(): assert v['mie'] in TIERS, (d, fy)
perdiem = {
    'source': 'GSA per diem ZIP code files FY2026 (published 2025-08-14) and FY2027 (published 2026-09-03), monthly lodging Oct..Sep; GSA per diem rates files FY2026 and FY2027 for county definitions',
    'months': ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    'standard': {str(k): v for k, v in standard.items()},
    'tiers': {str(k): {'breakfast': v[0], 'lunch': v[1], 'dinner': v[2], 'incidentals': v[3]} for k, v in TIERS.items()},
    'dest': D,
}
assert standard[2027] == {'lodging': 113, 'mie': 68} and standard[2026] == {'lodging': 110, 'mie': 68}, standard

# ---------- ZIPs: compact string. Sorted ZIPs; each entry "zip:i27:i26" with -1 standard, missing = absent
zl = sorted(zipmap)
enc = []
prev = 0
for z in zl:
    m = zipmap[z]; a = idx[m[2027]] if m.get(2027) else (-1 if 2027 in m else -2); b = idx[m[2026]] if m.get(2026) else (-1 if 2026 in m else -2)
    zi = int(z); enc.append(f'{zi - prev:x}' + ('' if a == -1 and b == -1 else f',{a+2:x},{b+2:x}')); prev = zi
zips = {'note': 'delta-coded ZIPs (hex); entries without a comma are standard CONUS in both years; otherwise dest index+2 for FY2027 then FY2026 (1 = standard, 0 = ZIP absent that year)', 'data': ';'.join(enc)}

# ---------- Census places (population >= 15,000) mapped to their main county, then to a destination
pop = {}
for r in csv.DictReader(open(os.path.join(RAW, 'subest.csv'), encoding='latin-1')):
    if r['SUMLEV'] in ('157',):
        pop.setdefault((r['STATE'], r['PLACE']), []).append((int(r['POPESTIMATE2024'] or 0), r['COUNTY']))
    if r['SUMLEV'] == '162':
        pop.setdefault(('T', r['STATE'], r['PLACE']), int(r['POPESTIMATE2024'] or 0))
county_name = {}
places = {}
place_counties = collections.defaultdict(list)
for r in csv.DictReader(open(os.path.join(RAW, 'place_county.txt'), encoding='latin-1'), delimiter='|'):
    county_name[(r['STATEFP'], r['COUNTYFP'])] = r['COUNTYNAME']
    places.setdefault((r['STATEFP'], r['PLACEFP']), (r['STATE'], r['PLACENAME'], r['TYPE']))
    place_counties[(r['STATEFP'], r['PLACEFP'])].append(r['COUNTYFP'])
def gsa_county(s):
    """'Miami/Dade County, FL' -> 'miami-dade'; 'Baltimore City, MD' -> 'baltimore city'."""
    c = s.split(',')[0].lower().replace('/', '-').replace('jeff n davis', 'jefferson davis')
    return re.sub(r' (county|parish)$', '', c).strip()
def census_county(s):
    c = s.lower().replace("'", "'")
    c = re.sub(r' (county|parish)$', '', c).strip()
    return [c, re.sub(r' city$', '', c)] if c.endswith(' city') else [c]
# A county belongs to the destination that holds most of its ZIP codes (Edwards AFB ZIPs sit in Kern
# County but belong to the Los Angeles area; Kern itself is Bakersfield).
nsa_by_county = {2027: {}, 2026: {}}
best = {2027: {}, 2026: {}}
for k in keys:
    d = dest[k]
    if d['counties'].lower().startswith('city limits of'): continue
    for cn, n in d['countyNames'].items():
        for fy in d['fy']:
            ck = (d['st'], gsa_county(cn)); fy = int(fy)
            if n > best[fy].get(ck, 0): best[fy][ck] = n; nsa_by_county[fy][ck] = k
P = []
for (sfp, pfp), (st, pname, typ) in places.items():
    if st not in NAME: continue
    total = pop.get(('T', sfp, pfp), 0)
    if total < 15000: continue
    cands = place_counties[(sfp, pfp)]
    parts = [c for _, c in sorted(pop.get((sfp, pfp), []), reverse=True) if c in cands]
    cfp = parts[0] if parts else cands[0]
    cname = county_name.get((sfp, cfp), '')
    nm = re.sub(r' (city|town|village|borough|municipality|CDP|city and borough|urban county|metropolitan government.*|consolidated government.*|unified government.*)$', '', pname).replace(' (balance)', '')
    row = [nm, st, cname]
    for fy in (2027, 2026):
        k = None
        for kk in keys:
            dd = dest[kk]
            if dd['st'] == st and dd['counties'].lower().startswith('city limits of') and dd['counties'].lower().endswith(nm.lower()) and str(fy) in dd['fy']: k = kk
        if not k:
            for ck in census_county(cname):
                k = nsa_by_county[fy].get((st, ck))
                if k: break
        row.append(idx[k] if k else -1)
    row.append(total)
    P.append(row)
P.sort(key=lambda r: -r[-1])
places_out = {'source': 'Census Bureau, 2020 place-by-county relationship file and Vintage 2024 population estimates (places of 15,000 people or more); county matched to the GSA FY2027 and FY2026 non-standard areas', 'cols': ['name', 'st', 'county', 'dest2027', 'dest2026', 'pop2024'], 'rows': P}

# ---------- EIA prices
def eia_last(f):
    b = xlrd.open_workbook(os.path.join(RAW, f)); out = {}
    for s in b.sheets()[1:]:
        last = s.nrows - 1
        d = (datetime.date(1899, 12, 30) + datetime.timedelta(days=s.cell_value(last, 0))).isoformat()
        for c in range(1, s.ncols):
            out[s.cell_value(2, c)] = (s.cell_value(last, c), d)
    return out
gas = eia_last('gas_reg.xls'); dsl = eia_last('dsl.xls')
def find(series, word):
    for k, v in series.items():
        if re.search(r'Weekly ' + re.escape(word) + r' (Regular|No 2)', k): return v
    return None
PADDNAME = {'1A': 'New England (PADD 1A)', '1B': 'Central Atlantic (PADD 1B)', '1C': 'Lower Atlantic (PADD 1C)', '2': 'Midwest', '3': 'Gulf Coast', '4': 'Rocky Mountain', '5': 'West Coast (PADD 5) Except California'}
ws = openpyxl.load_workbook(os.path.join(RAW, 'elec56b.xlsx'), read_only=True).worksheets[0]
erows = list(ws.iter_rows(values_only=True)); eperiod = clean(erows[1][0])
elec = {clean(r[0]): r[1] for r in erows[4:] if r[0] and isinstance(r[1], (int, float))}
states = []
for ab, nm in STATES:
    g = find(gas, nm); gsrc = nm
    if not g: g = find(gas, PADDNAME[PADD[ab]]); gsrc = PADDNAME[PADD[ab]]
    dsrc = PADDNAME[PADD[ab]] if ab != 'CA' else 'California'
    dl = find(dsl, dsrc)
    states.append({'abbr': ab, 'name': nm, 'slug': slug(nm), 'padd': PADD[ab], 'gas': g[0], 'gasArea': gsrc, 'diesel': dl[0], 'dieselArea': dsrc, 'elecCents': elec[nm]})
us_g = find(gas, 'U.S.'); us_d = find(dsl, 'U.S.')
energy = {'gasWeek': us_g[1], 'usGas': us_g[0], 'usDiesel': us_d[0], 'elecPeriod': eperiod, 'usElecCents': elec.get('U.S. Total'), 'states': states}

# ---------- EPA vehicles: 2026 model year (and 2027 where published) of the common nameplates
veh = list(csv.DictReader(open(os.path.join(RAW, 'vehicles.csv'), encoding='latin-1')))
PICK_GAS = [('Toyota', 'Camry'), ('Toyota', 'RAV4'), ('Honda', 'CR-V'), ('Honda', 'Civic'), ('Ford', 'F150'), ('Chevrolet', 'Silverado'), ('Ram', '1500'), ('Toyota', 'Corolla'), ('Nissan', 'Rogue'), ('Jeep', 'Grand Cherokee'), ('Subaru', 'Outback'), ('Hyundai', 'Elantra'), ('Toyota', 'Tacoma'), ('Chevrolet', 'Equinox'), ('Honda', 'Accord'), ('Toyota', 'Highlander')]
gasv = []
for mk, mdl in PICK_GAS:
    c = [v for v in veh if v['make'] == mk and v['year'] in ('2026',) and v['atvType'] in ('', 'Hybrid', 'Diesel', 'FFV') and re.match(re.escape(mdl) + r'(\b| )', v['model'])]
    if not c: continue
    best = sorted(c, key=lambda v: (v['atvType'] != '', int(v['comb08'])))
    base = [v for v in best if v['atvType'] == ''] or best
    v = sorted(base, key=lambda v: (len(v['model']), v['model']))[0]   # the plainest variant
    gasv.append({'id': v['id'], 'label': f"{v['year']} {mk} {v['model']} ({v['displ']} L, {v['drive'].split(' ')[0]})", 'mpg': int(v['comb08']), 'fuel': 'diesel' if 'Diesel' in v['fuelType'] else 'gas'})
evv = []
for v in veh:
    if v['atvType'] == 'EV' and v['year'] in ('2026', '2027') and (v['make'] in ('Tesla',) or (v['make'], v['model'].split(' ')[0]) in {('Chevrolet', 'Equinox'), ('Ford', 'Mustang'), ('Hyundai', 'Ioniq'), ('Kia', 'EV6'), ('Rivian', 'R1S'), ('Rivian', 'R1T'), ('Chevrolet', 'Bolt'), ('Nissan', 'Leaf'), ('Kia', 'EV9'), ('Ford', 'F150'), ('Honda', 'Prologue'), ('Cadillac', 'LYRIQ')}):
        evv.append({'id': v['id'], 'make': v['make'], 'year': v['year'], 'label': f"{v['year']} {v['make']} {v['model']}", 'kwh100': round(float(v['combE']), 2), 'range': int(v['range'] or 0)})
evv.sort(key=lambda e: (e['make'] != 'Tesla', e['label'], e['year']))
seen = {}
for e in evv: seen[e['label'].split(' ', 1)[1]] = e   # one entry per model name, latest model year
evv = sorted(seen.values(), key=lambda e: (e['make'] != 'Tesla', e['label']))
per = collections.defaultdict(list)
for e in sorted(evv, key=lambda e: len(e['label'])):
    if e['make'] == 'Tesla' or len(per[e['make']]) < 2: per[e['make']].append(e)
evv = sorted([e for v in per.values() for e in v], key=lambda e: (e['make'] != 'Tesla', e['label']))
vehicles = {'source': 'EPA / DOE fueleconomy.gov vehicles.csv (combined MPG, combined kWh/100 mi and EPA range)', 'gas': gasv, 'ev': evv}

for name, obj in [('perdiem', perdiem), ('zips', zips), ('places', places_out), ('energy', energy), ('vehicles', vehicles)]:
    json.dump(obj, open(os.path.join(OUT, f'{name}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    print(name, os.path.getsize(os.path.join(OUT, f'{name}.json')))
print('dest', len(D), 'places', len(P), 'zips', len(zl), 'gas veh', len(gasv), 'ev', len(evv))
