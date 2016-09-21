VERSION = None
with open('version.txt', 'r') as version_file:
    VERSION = version_file.read()


def cache_bust(request):
    return {
        'cachebust': 'version=%s' % VERSION
    }
