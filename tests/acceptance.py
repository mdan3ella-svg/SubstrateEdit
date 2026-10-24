from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./src/style.css">','<style>'+(root/'src/style.css').read_text()+'</style>')
html=html.replace('<script type="module" src="./src/app.js"></script>','<script>'+(root/'src/app.js').read_text()+'</script>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1500,'height':900});errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.set_content(html)
 assert page.evaluate('SUBSTRATE.App.initialized')
 page.locator('[data-action="sample"]').click(); assert page.evaluate('SUBSTRATE.App.doc.elements.length')==6
 page.locator('[data-view="plan"]').click()
 page.locator('[data-tool="window"]').click()
 pos=page.evaluate('''() => {const c=SUBSTRATE.App.camera,r=document.querySelector('#viewport').getBoundingClientRect();return {x:r.left+r.width/2+c.ox,y:r.top+r.height/2+c.oy-2000*c.scale}}''')
 page.mouse.click(pos['x'],pos['y'])
 assert page.evaluate('SUBSTRATE.App.doc.elements.length')==7
 assert page.evaluate('SUBSTRATE.App.doc.elements.at(-1).hostId===SUBSTRATE.App.doc.elements[1].id')
 assert page.evaluate('SUBSTRATE.openingSegments(SUBSTRATE.App.doc.elements[1]).length')>=3
 page.locator('[data-action="audit"]').click()
 assert 'passed' in page.locator('#results').inner_text()
 page.locator('[data-action="schedule"]').click();assert page.locator('#overlay table').count()==1
 page.locator('[data-action="close-overlay"]').click()
 page.locator('[data-action="undo"]').click(); assert page.evaluate('SUBSTRATE.App.doc.elements.length')==6
 page.locator('[data-action="redo"]').click(); assert page.evaluate('SUBSTRATE.App.doc.elements.length')==7
 page.locator('[data-action="sheet"]').first.click(); assert page.locator('#overlay svg').count()==4
 assert not errors, errors
 print('PASS runtime: load, sample, hosted window, wall void segments, audit, schedule, undo, redo, 4 ortho sheet; 0 page errors')
 b.close()
