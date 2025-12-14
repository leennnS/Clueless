import requests
for outfitId in range(1, 10):
    payload={
        "query": "query OutfitItemsByOutfit($outfitId: Int!) { outfitItemsByOutfit(outfitId: $outfitId) { outfit_item_id } }",
        "variables": {"outfitId": outfitId}
    }
    res = requests.post('http://localhost:3000/graphql', json=payload)
    data = res.json()
    length = len(data.get('data', {}).get('outfitItemsByOutfit', []))
    print(outfitId, length)
