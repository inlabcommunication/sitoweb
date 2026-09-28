# Rigenera content/blog/index.json dai frontmatter degli articoli.
import json, pathlib, yaml
root = pathlib.Path(__file__).resolve().parent.parent / 'content' / 'blog'
keys = ['slug', 'title', 'h1', 'metaTitle', 'metaDescription', 'excerpt', 'date', 'updated', 'author',
        'category', 'tags', 'readingTime', 'heroImage', 'related']
posts = []
for f in sorted(root.glob('*.md')):
    if f.name == 'README.md':
        continue
    fm = yaml.safe_load(f.read_text(encoding='utf-8').split('---', 2)[1])
    assert fm['slug'] == f.stem, f'slug diverso dal nome file: {f.name}'
    posts.append({k: fm.get(k) for k in keys} | {'file': f'content/blog/{f.name}'})
posts.sort(key=lambda p: (str(p['date']), p['slug']), reverse=True)
(root / 'index.json').write_text(json.dumps(posts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(posts)} articoli in content/blog/index.json')
