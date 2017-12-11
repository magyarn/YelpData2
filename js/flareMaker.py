import json
from pprint import pprint

data = json.load(open('AArestaurants.json'))


count = 0
records = {}
cuisines = []


flare2 = {"name":"Ann Arbor Restaurants",
        "children": [],
        }




for d in data["businesses"]:
    pprint(d)
    rating = d["rating"]
    review_count = d["review_count"]
    try:
        if d["price"]:
            price = d["price"]
            for cat in d["categories"]:
                cuisine = cat["title"]
                if cuisine not in cuisines:
                    cuisines.append(cuisine)
                    records[cuisine] = [price]
                    flare2["children"].append({"name": cuisine,
                                               "children":[{"name":price,
                                                            "children":[{"name":d["name"],
                                                                        "size":1,
                                                                        "rating":d["rating"],
                                                                        "review_count":d["review_count"]
                                                                        }]
                                                          }]
                                             })
                else:
                    if price not in records[cuisine]:
                        records[cuisine].append(price)
                        flare2["children"][cuisines.index(cuisine)]["children"].append({"name": price,
                                                                                       "children": [{"name":d["name"],
                                                                                                    "size": 1,
                                                                                                    "rating":d["rating"],
                                                                                                    "review_count":d["review_count"]
                                                                                                    }]
                                                                                         })
                    else:
                        flare2["children"][cuisines.index(cuisine)]["children"][records[cuisine].index(price)]["children"].append({
                                                                                                                        "name":d["name"],
                                                                                                                        "size":1,
                                                                                                                        "rating":d["rating"],
                                                                                                                        "review_count":d["review_count"]
                                                                                                                      })
    except KeyError:
        pass




flare2["children"].sort(key=lambda x: len(x["children"][0]["children"]), reverse=True);
# pprint(flare2["children"])


with open('AAflare.json', 'w') as outfile:
    json.dump(flare2, outfile)
