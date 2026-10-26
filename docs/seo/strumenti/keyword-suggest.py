import json,urllib.request,urllib.parse,time,collections
def sug(q):
    u="https://suggestqueries.google.com/complete/search?client=firefox&hl=it&gl=it&q="+urllib.parse.quote(q)
    try: return json.loads(urllib.request.urlopen(u,timeout=10).read().decode('utf-8','ignore'))[1]
    except Exception: return []
seeds=["social media manager","gestione social","agenzia comunicazione","agenzia marketing","realizzazione siti web","fotografo","videomaker","sponsorizzate facebook","consulente marketing","web agency"]
places=["taranto","castellaneta","bari","lecce","puglia","matera","martina franca","massafra"]
out=collections.OrderedDict()
for s in seeds:
    for p in places:
        for x in sug(f"{s} {p}")+sug(f"{s} {p} "):
            out[x]=1
        time.sleep(0.15)
for q in ["quanto costa un social media manager","quanto costa gestione social","quanto costa un sito web","come promuovere","come pubblicizzare","marketing per ristoranti","marketing per","social per"]:
    for x in sug(q): out[x]=1
open('kw.txt','w').write("\n".join(out))
print(len(out)); print("\n".join(list(out)[:400]))
