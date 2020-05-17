import pymongo
import operator
from typing import List
import elasticsearch
from datetime import datetime


class MongoDriver:

    def __init__(self, tolerance=50.0):
        self.conn = pymongo.MongoClient()
        self.db = self.conn['faces']
        self.collection = self.db['faces1']
        self.tolerance = tolerance

    def format_vector(self, vec: List[float]):
        return ';'.join([str(eval("%.0e" % (x,))) for x in vec])

    def add_face(self, name: str, vec: List[float]):
        document = {
            'name': name,
            'features': {}
        }
        for i in range(128):
            document['features'][f'feature{i}'] = vec[i]

        document['Vector'] = vec
        document['StrVector'] = self.format_vector(vec)

        self.collection.insert_one(document)

    def query(self, vec: List[float]):
        query = {}
        for i in range(128):
            feature_key = f'features.feature{i}'
            diff = abs(self.tolerance * vec[i])
            query[feature_key] = {'$gte': vec[i] - diff, '$lte': vec[i] + diff}
        # print('Query', query)
        results = list(self.collection.find(query, {'name': 1}))
        if not len(results):
            return 'Unknown'
        print('Found faces')

        names = {}
        for entry in results:
            name = entry['name']
            if name not in names:
                names[name] = 1
            else:
                names[name] += 1

        return max(names.items(), key=operator.itemgetter(1))[0]


class ElasticDriver:

    def __init__(self, tolerance=100):
        self.es = elasticsearch.Elasticsearch(hosts=['http://localhost:9200/'])

    def add_face(self, name: str, vec: List[float]):
        document = {
            'Name': name,
            'Features': {},
            '@timestamp': datetime.now().isoformat()
        }

        # https://stackoverflow.com/questions/32812255/round-floats-down-in-python-to-keep-one-non-zero-decimal-only

        for i in range(128):
            document['Features'][f'Feature{i}'] = vec[i]

        document['Vector'] = vec

        document['StrVector'] = self.format_vector(vec)

        self.es.index('faces', document)

    def format_vector(self, vec: List[float]):
        return ';'.join([str(eval("%.0e" % (x,))) for x in vec])

    def query(self, vec: List[float]):
        q = {
            "query": {
                "fuzzy": {
                    "user": {
                        "value": self.format_vector(vec),
                        "fuzziness": 50
                    }
                }
            }
        }

        res = self.es.search(index='faces', body=q)
        print('Res', res)



