from pathlib import Path
from bs4 import BeautifulSoup
import re,subprocess
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'index.html').read_text(),'html.parser')
js=(root/'src/app.js').read_text()
ids=[e['id'] for e in soup.select('[id]')]
assert len(ids)==len(set(ids)),'duplicate IDs'
for target in re.findall(r"(?<!\$)\$\('([^']+)'\)",js):
 assert target in ids or target in re.findall(r'id=\"([^\"]+)\"',js), 'Missing control: '+target
for script in soup.select('script[src]'):
 assert (root/script['src']).is_file(),script['src']
for style in soup.select('link[rel=stylesheet]'):
 assert (root/style['href']).is_file(),style['href']
subprocess.run(['node','--check',str(root/'src/app.js')],check=True)
for action in ['new','open','save','undo','redo','sample','fit','sheet','export-svg','export-png','guide','duplicate','delete','schedule','audit','section','presentation','plot']:
 assert soup.select(f'[data-action="{action}"]'),action
for tool in ['select','pan','wall','slab','column','beam','door','window','line','dimension']:
 assert soup.select(f'[data-tool="{tool}"]'),tool
print('PASS: unique IDs, controls connected, files present, script syntax valid.')
