
/* ================= CONFIG ================= */
const MODE='public';
const PROFILE={followers:5587,posts:632,verified:true,asOf:'2026-10-30'};
const SITE={name:'Antara',url:(document.querySelector('meta[name=site-url]')?.content||'').replace(/\/+$/,''),
 tagline:'Bengali food creator, recipe developer and culinary storyteller based in Bangalore'};
const ROUTING=(MODE==='public'&&document.querySelector('meta[name=routing]')?.content==='path'&&/^https?:$/.test(location.protocol))?'path':'hash';
const BASE=ROUTING==='path'?(document.querySelector('meta[name=site-base]')?.content||'/').replace(/\/+$/,''):'';
const pathHref=h=>BASE+(h==='/'?'/':h.replace(/\/?(\?|$)/,'/$1'));
function hrefFix(root){if(ROUTING!=='path'||!root)return;root.querySelectorAll('a[href^="#/"]').forEach(a=>a.setAttribute('href',pathHref(a.getAttribute('href').slice(1))))}
/* ================= HELPERS ================= */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=> 'id'+Math.random().toString(36).slice(2,9);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Curated food photography (Unsplash licence). Swap any ID for Antara's own shots, or paste a full image URL as a seed in the Studio. */
const U='https://images.unsplash.com/photo-';
const PHOTO={
 'antara-hero-kitchen-light':'1585937421612-70a008356fbe','hero-side-luchi':'1567337710282-00832b415979',
 'antara-portrait-apron-flour':'1528712306091-ed0763094c98','hands-mise-en-place-prep':'1551218808-94e220e084d2',
 'shorshe-ilish-monsoon-curry':'1574484284002-952d92456975','mishti-doi-cheesecake-slice':'1524351199678-941a58a3df50',
 'tomato-khichdi-warm-bowl':'1512058564366-18510be2db19','gondhoraj-lemon-cake-loaf':'1565958011703-44f9829ba187',
 'bhapa-pitha-steam-cakes':'1589301760014-d929f3979dbc','chingri-posto-poppy-prawns':'1559847844-5315695dadae',
 'nolen-gur-payesh':'1488477181946-6428a0291777',
 'fortune-onepot-steam-rice':'1631515243349-e0cb75fb8d3a','anveshan-oil-ritual-pour':'1466637574441-749b8f19452f',
 'masterchow-wok-flame-street':'1599487488170-d11ec9c172f0','kapiva-wellness-morning-glass':'1630383249896-424e482df921',
 'cookme-pantry-shelf-jars':'1601050690117-94f5f6fa8bd7','kilrr-spice-tins-flatlay':'1606843046080-45bf7a23c39f',
 'partition-plates-thali-heritage':'1546833999-b9f581a1996d',
 'monsoon-kitchen-window-rain':'1515694346937-94d85e41e6f0','spice-market-cards-assorted':'1571934811356-5cc061b6821f',
 'pantry-amber-jars-light':'1571877227200-a0d98ea607e9|bottom','sugar-linen-flatlay-pantry':'1505576399279-565b52d4ac71',
 'academy-bench-flour-lesson':'1509440159596-0249088772ff','closing-thali':'1542367592-8849eb950fd8',
 'insta-butter-paneer-copper':'1631452180519-c014fe946bc7','insta-palak-paneer-dark':'1589647363585-f4a7d3877b10',
 'insta-sunday-curry':'1574653853027-5382a3d23a15','insta-one-pan-supper':'1596797038530-2c107229654b',
 'insta-samosa-and-chilli':'1601050690597-df0568f70950','insta-naan-and-gravy':'1565557623262-b51c2513a641'
};
function photoURL(seed,w,h){
 if(!seed)return '';
 if(seed.startsWith('reel:')){const c=seed.slice(5);return (w>400&&REEL_HIRES[c])||REEL_COVERS[c]||''}
 if(seed==='portrait')return PORTRAIT;
 if(/^(data:|https?:)/.test(seed))return seed;
 const [id,crop]=(PHOTO[seed]||'').split('|');
 if(id){const u=`${U}${id}?w=${w}${h?`&h=${h}`:''}&fit=crop&crop=${crop||'entropy'}&q=72&auto=format`;return (typeof STOCK_MAP!=='undefined'&&STOCK_MAP[u])||u}
 return `https://picsum.photos/seed/${seed}/${w}/${h||w}`;
}
const img=(seed,w,h,alt,extra='')=>{
 const s1=photoURL(seed,Math.round(w*.6),Math.round(h*.6)),s2=photoURL(seed,w,h),s3=photoURL(seed,Math.min(w*1.6|0,2000),Math.min(h*1.6|0,2400));
 const ss=/^(data:|https?:|reel:|portrait)/.test(seed)?'':` srcset="${s1} ${Math.round(w*.6)}w, ${s2} ${w}w, ${s3} ${Math.min(w*1.6|0,2000)}w" sizes="(max-width:640px) 100vw, (max-width:1060px) 60vw, 46vw"`;
 return `<img src="${s2}"${ss} width="${w}" height="${h}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`};
const fmtD=ts=>new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const fmtDT=ts=>new Date(ts).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

/* ================= REELS ================= */
const reelBy=c=>REELS.find(r=>r.c===c)||{v:0,l:0,s:0};
const fmtN=n=>n>=1e6?(n/1e6).toFixed(2).replace(/\.?0+$/,'')+'M':n>=1e4?Math.round(n/1e3)+'K':n>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,'')+'K':String(n);
const fmtDur=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const visReels=()=>REELS.filter(r=>!(DB.reelHidden||[]).includes(r.c));
const IGURL=()=>'https://www.instagram.com/'+String(DB.settings.instagram||REEL_HANDLE).replace(/^@/,'')+'/';
const RCATS=[['All',''],['Bengali','B'],['Chicken & Meat','C'],['Fish & Seafood','F'],['Vegetarian','V'],['Sweets & Baking','S'],['High-Protein','P'],['Festive','X'],['Street & Snacks','T'],['Global','G'],['Brand Collabs','*'],['Life & Travel','L']];
const mediaBy=c=>REELS.find(r=>r.c===c)||EXTRA.find(r=>r.c===c);
const median=a=>{const s=a.slice().sort((x,y)=>x-y),n=s.length;return n?(n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2):0};
function projVisual(p){const m=(p.media||[]).map(mediaBy).filter(Boolean);if(!m.length)return '';
 return `<div class="wv ${m[0].k==='photo'?'is-photo':''}"><img class="wv-bg" src="${REEL_COVERS[m[0].c]}" alt="" aria-hidden="true"><div class="wv-fan">${m.slice(0,3).map((x,i)=>`<img class="f${i}" src="${REEL_COVERS[x.c]}" alt="${i?'':esc(p.title)+' — '+esc(x.t)}">`).join('')}</div>${m.length>3?`<span class="wv-n">+${m.length-3} more</span>`:''}</div>`}
const pimg=(p,w,h,alt)=>projVisual(p)||img(p.seed,w,h,alt);
function projStats(p){const m=(p.media||[]).map(mediaBy).filter(Boolean),wv=m.filter(x=>x.v);return{m,n:m.length,v:wv.reduce((a,x)=>a+x.v,0),nv:wv.length,l:m.reduce((a,x)=>a+(x.l||0),0),top:wv.slice().sort((a,b)=>b.v-a.v)[0]}}
function reelStats(list){list=list||visReels();const v=list.reduce((a,r)=>a+r.v,0),l=list.reduce((a,r)=>a+r.l,0);return{n:list.length,v,l,top:list.reduce((a,r)=>r.v>a.v?r:a,{v:0}),brand:list.filter(r=>r.b).length,brands:new Set(list.filter(r=>r.b).map(r=>r.b)).size}}
function reelCard(r,i=0,cls=''){return `<button class="reel ${r.k==='photo'?'is-photo':''} ${cls}" data-action="reel-open" data-code="${r.c}" aria-label="${r.k==='photo'?'View photo post':'Play reel'}: ${esc(r.t)}, ${r.v?fmtN(r.v)+' plays':fmtN(r.l)+' likes'}" style="transition-delay:${(i%6)*.05}s" data-reveal>
 <span class="reel-ph">${img('reel:'+r.c,r.k==='photo'?640:324,r.k==='photo'?800:576,r.t)}<span class="reel-play" aria-hidden="true">▶</span>${r.s?`<span class="reel-dur">${fmtDur(r.s)}</span>`:r.k==='photo'?'<span class="reel-dur">Photo</span>':`<span class="reel-dur">${r.d.slice(0,4)}</span>`}${r.b?`<span class="reel-brand" title="${esc(disclosure(r))}">${esc(r.b)}${adTag(r)?' · Ad':''}</span>`:''}
 <span class="reel-meta"><b>${esc(r.t)}</b><em>${r.v?`▶ ${fmtN(r.v)} plays`:`♥ ${fmtN(r.l)} likes`}</em></span></span></button>`}
function reelProof(){const st=reelStats();return `<div class="proof" data-reveal>
 <div><b data-count="${st.v}">${fmtN(st.v)}</b><span>plays across her last ${st.n} reels</span></div>
 <div><b data-count="${st.top.v}">${fmtN(st.top.v)}</b><span>on a single reel — ${esc(st.top.t||'')}</span></div>
 <div><b data-count="${st.l}">${fmtN(st.l)}</b><span>likes from home cooks</span></div>
 <div><b>${st.brand}</b><span>brand reels with ${st.brands} partners</span></div></div>
 <p class="fineprint" style="margin-top:10px">Instagram figures as of ${fmtD(Date.parse(REEL_SYNC))} · <a href="#/reels" style="border-bottom:1px solid">watch the reels →</a></p>`}

/* ================= STORE ================= */
const KEY='antara_studio_v1', SKEY='antara_session', AKEY='antara_attempts';
const clone=o=>JSON.parse(JSON.stringify(o));
let DB;
function save(){if(MODE!=='studio')return;localStorage.setItem(KEY,JSON.stringify(DB))}
function loadDB(){if(MODE!=='studio')return seed();try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===3)return d}catch(e){} const d=seed();localStorage.setItem(KEY,JSON.stringify(d));return d}
const SERVICES_DEFAULT=[
 {n:'Sponsored recipe reels',d:"A recipe reel built around the role your product genuinely plays in the dish — posted on her Instagram with clear #ad disclosure.",inc:['1 reel, 30–60 seconds','Full recipe in the caption','Story mentions on the day it goes live'],add:['Extra story frames','Raw footage','Cut-downs for ads'],lead:'2–3 weeks',use:"Organic on Antara's channels. Brand reposts and paid usage are licensed separately for an agreed term."},
 {n:'Original recipe development',d:'Recipes tested in a home kitchen until they work every time — written for your audience and your product.',inc:['1–4 tested recipes','Ingredient lists and methods','Swap and serving notes'],add:['Step-by-step photos','Recipe cards','Video'],lead:'3–4 weeks',use:'Licensed to the brand for agreed channels and term.'},
 {n:'Food photography',d:'Styled, editorial stills of your product inside real dishes.',inc:['6–12 edited images','Food styling and props','Web-ready files'],add:['Extra angles','Recipe-card layouts','Print-ready files'],lead:'2–3 weeks',use:'Digital usage for an agreed term; print and outdoor quoted separately.'},
 {n:'UGC for brand channels',d:'Native-feeling vertical videos for your own pages and ads — not posted on her feed.',inc:['3–6 vertical videos','2–3 opening-hook variations','Captions and on-screen text'],add:['Raw footage','Extra hooks','Voice-over'],lead:'2–3 weeks',use:'Paid-social licence for an agreed term.'},
 {n:'Seasonal campaigns',d:'Content timed to the moments people already cook for — Durga Puja, Diwali, Poila Baisakh, Navratri, Christmas.',inc:['Campaign concept','2–4 recipe reels','Posting calendar'],add:['Photography','Recipe development','Collab posts'],lead:'Book 4–6 weeks before the festival',use:'Agreed per campaign.'},
 {n:'Long-term partnerships',d:'A steady presence over months, so the product becomes part of her kitchen rather than a one-off guest.',inc:['2–4 pieces a month','Monthly content plan','Monthly performance summary'],add:['Recipe development','Photography','UGC'],lead:'Minimum 3 months',use:'Agreed in the partnership terms.'}];
function homeSections(){const sec=(id,key,label,f)=>({id,key,label,visible:true,f});return [
 sec('s-hero','hero','Hero',{kicker:'Bengali food creator & recipe developer · Bangalore',h1a:'Made with intention.',h1b:'Shared with love.',sub:'Original recipes, cinematic food stories and culturally grounded campaigns — for modern home cooks and for thoughtful food and kitchen brands.',cta1:'View brand work',href1:'#/work',cta2:'Plan a collaboration',href2:'#/collaborate',note:''}),
 sec('s-work','work','Selected Work',{kicker:'01 · Selected Work',headline:'Stories, served beautifully.',sub:'Brand partnerships, recipe series and festival food — chosen from two years of posts by what people actually watched.',cta:'Explore All Work',href:'#/work'}),
 sec('s-brands','brands','Proof & Partners',{kicker:'02 · Proof',headline:'Recipes with cultural memory. Content with measurable reach.',sub:'From Bengali festival cooking to practical weeknight meals, Antara turns real culinary insight into reels, photography and campaigns built for attention — and usefulness.'}),
 sec('s-services','services','Services',{kicker:'03 · Services',headline:'Ways to work together.',sub:'From one hero recipe to a season-long content partnership, every project begins with the audience, the cultural moment and the role the product can honestly play.',cta:'Services, process & enquiry',href:'#/collaborate'}),
 sec('s-intro','intro','About Antara',{kicker:'04 · About',headline:'A little more than a love for food.',body:"Antara is a Bengali food creator, recipe developer and culinary storyteller based in Bangalore. She develops original recipes and produces culturally rooted food films, photography and campaigns — for her own audience and for brands.\n\nHer kitchen is a studio: part archive of Bengali flavour, part laboratory for what those flavours can become — from niramish cholar dal for Pujo to a fifteen-minute chicken rice for a tired weeknight.",quote:'A recipe is a story you can eat.',cta:'Meet Antara',href:'#/about'}),
 sec('s-rec','recipes','Featured Recipes',{kicker:'05 · Recipes',headline:'From her kitchen.',sub:'Recipes from her most-watched reels — written out in full, with the reel alongside.',cta:'Explore the Recipes',href:'#/recipes'}),
 sec('s-close','closing','Collaboration CTA',{headline:"Let's make something memorable.",sub:'For food, kitchen and lifestyle brands that want more than product placement: original recipes, considered storytelling and content people genuinely want to save and cook.',cta1:'Plan a collaboration',href1:'#/collaborate',cta2:'Request media kit',href2:'#/collaborate?type=media-kit'}),
 sec('s-next','next','Coming Next & Newsletter',{kicker:'07 · Coming next',headline:'Two chapters in the making.',sub:"Neither is open yet — they launch only when they are genuinely ready. Join the Sunday Note to hear first."})]}
function seed(){
 const now=Date.now(), day=864e5;
 const sec=(id,key,label,f)=>({id,key,label,visible:true,f});
 return {v:3,
 settings:{email:'',instagram:'@artisan.antara',signature:'Food. Creativity. Connection.',location:'Bangalore, India',formKey:''},mig30:1,services:clone(SERVICES_DEFAULT),
 tokens:{theme:'ivory',display:'Fraunces',body:'Manrope',accent:'burg',radius:3},
 users:[],
 pages:{home:{dirty:false,trash:[],live:homeSections()}},
 recipes:[
  {id:'r1',slug:'shorshe-ilish-the-monsoon-way',title:'Shorshe Ilish, the Monsoon Way',cat:'Bengali & Regional',prep:'15 min',cook:'25 min',serves:'4',status:'draft',featured:false,date:now-6*day,seed:'shorshe-ilish-monsoon-curry',excerpt:'Hilsa steamed in a sharp green-mustard paste — the dish the rains were invented for.',video:'ilish-steam-reel',
   ingredients:['1 large hilsa (ilish), cut into steaks','4 tbsp mustard seeds, soaked','6–8 green chillies','1 tbsp posto (poppy seed)','½ tsp turmeric','2 tbsp mustard oil','Salt, to taste','Steamed rice, to serve'],
   steps:['Grind the soaked mustard seeds and posto with 2 green chillies and a splash of water to a smooth, pale paste.','Rub the steaks gently with turmeric and salt. Do not rush this — the fish should be coated, not bruised.','Smear two-thirds of the paste over the fish and let it rest for ten minutes.','Layer the remaining paste in a shallow dish, lay the fish on top, drizzle with mustard oil and scatter over slit chillies.','Steam, covered, for 12–14 minutes — just until the fish yields at the bone. Serve immediately with steamed rice.']},
  {id:'r2',slug:'brown-butter-mishti-doi-cheesecake',title:'Brown-Butter Mishti Doi Cheesecake',cat:'Baking & Desserts',prep:'40 min',cook:'60 min + set',serves:'10',status:'draft',featured:false,date:now-12*day,seed:'mishti-doi-cheesecake-slice',excerpt:'Caramelised doi folded into a baked cheesecake on a gur-jaggery biscuit base. Bengali memory, patisserie structure.',video:'cheesecake-bake-reel',
   ingredients:['300 g digestive biscuits','90 g butter, browned','2 tbsp grated jaggery (gur)','600 g cream cheese','250 g mishti doi, drained','150 g sugar','3 eggs','1 tsp vanilla','Pinch of salt'],
   steps:['Blitz biscuits, fold through the brown butter and gur, and press firmly into a lined tin. Chill.','Beat cream cheese and sugar until just smooth — overbeating is the enemy of a clean slice.','Work in the drained mishti doi, then the eggs one at a time, with the vanilla and salt.','Bake in a water bath at 150°C for about an hour, until the centre barely trembles.','Cool in the oven with the door ajar, then refrigerate overnight. Patience is an ingredient.']},
  {id:'r3',slug:'tomato-khichdi-for-slow-evenings',title:'Tomato Khichdi for Slow Evenings',cat:'Everyday Cooking',prep:'10 min',cook:'30 min',serves:'3',status:'draft',featured:false,date:now-20*day,seed:'tomato-khichdi-warm-bowl',excerpt:'Soft rice and moong dal cooked down with charred tomato and ghee — weeknight comfort, taken seriously.',
   ingredients:['1 cup gobindobhog rice','½ cup moong dal, toasted','3 ripe tomatoes','1 tbsp ghee','1 tsp cumin','2 bay leaves','4 green chillies','Salt and a pinch of sugar'],
   steps:['Char the tomatoes over flame until blistered, then crush roughly.','Bloom cumin and bay in ghee; add the tomatoes and cook until jammy.','Tip in rice and dal, toast for two minutes, then add 4½ cups of warm water.','Simmer covered until everything collapses into silk — about 25 minutes.','Finish with slit chillies and a spoon of raw ghee. Eat standing at the stove if necessary.']},
  {id:'r4',slug:'gondhoraj-lemon-cake',title:'Gondhoraj Lemon Cake',cat:'Baking & Desserts',prep:'20 min',cook:'45 min',serves:'8',status:'draft',featured:false,date:now-26*day,seed:'gondhoraj-lemon-cake-loaf',excerpt:'The fragrance of a gondhoraj lemon is the recipe; the batter is just how you serve it.',
   ingredients:['220 g flour','180 g sugar','150 g butter, soft','3 eggs','Zest of 2 gondhoraj lemons','60 ml lemon juice','120 ml milk','2 tsp baking powder','½ tsp salt'],
   steps:['Rub the zest into the sugar until it smells like a Kolkata summer.','Cream with butter, then beat in eggs one at a time.','Alternate the flour and milk, finishing with the juice — fold, do not thrash.','Bake at 170°C for 45 minutes, until springy and golden.','Soak with a thin lemon-sugar glaze while still warm.']},
  {id:'r5',slug:'bhapa-pitha-reimagined',title:'Bhapa Pitha, Reimagined',cat:'Celebrations',prep:'30 min',cook:'20 min',serves:'6',status:'draft',featured:false,date:now-34*day,seed:'bhapa-pitha-steam-cakes',excerpt:'Winter rice-cakes with date-palm jaggery and coconut, shaped for a modern table.',
   ingredients:['2 cups rice flour','1 cup grated coconut','150 g khejur gur','2 tbsp ghee','Warm milk, as needed','Pinch of salt'],
   steps:['Melt the gur gently with the coconut until glossy and fragrant.','Bring rice flour together with warm milk into a soft, pliable dough.','Shape around the coconut-gur heart, sealing carefully.','Steam for 10–12 minutes; brush with ghee the moment they emerge.','Serve warm — pitha waits for no one.']},
  {id:'r6',slug:'chingri-posto-wedding-season',title:'Chingri Posto, Wedding Season',cat:'Bengali & Regional',prep:'20 min',cook:'25 min',serves:'4',status:'draft',featured:false,date:now-41*day,seed:'chingri-posto-poppy-prawns',excerpt:'Prawns folded through a silky poppy-seed paste — the dish that signals a celebration.',
   ingredients:['500 g large prawns','4 tbsp white poppy seed','10 cashews, soaked','2 green chillies','½ tsp turmeric','1 tsp sugar','2 tbsp mustard oil','Salt'],
   steps:['Grind poppy seed and cashew to a fine, creamy paste.','Sear the prawns briefly in mustard oil; set aside.','Cook the paste with turmeric and slit chillies until it leaves the edges of the pan.','Return the prawns, season, and finish with sugar and a raw drizzle of oil.','Serve with luchi, as tradition insists.']},
  {id:'r7',slug:'nolen-gurer-payesh',title:'Nolen Gurer Payesh',cat:'Celebrations',prep:'15 min',cook:'50 min',serves:'6',status:'draft',featured:false,date:now-2*day,seed:'nolen-gur-payesh',excerpt:'Winter rice pudding with date-palm jaggery — in progress.',ingredients:['1 cup gobindobhog rice','1.5 l milk','200 g khejur gur','2 cardamom'],steps:['Reduce the milk slowly.','Add rice, cook till soft.','Off the heat, fold in gur.']}
 ],
 projects:[
  {id:'p1',slug:'fortune-steam-and-spice',title:'Steam & Spice: One-Pot Evenings',brand:'Fortune',cat:'Recipe Development',format:'Reels + Recipes',type:'Paid partnership',year:2025,status:'published',featured:true,seed:'fortune-onepot-steam-rice',
   brief:"Build a winter series around one-pot rice dishes using the brand's staple range — warm, domestic, effortless.",role:'Recipe development, food styling, on-camera presenter',concept:'Six single-vessel recipes shot in real evening kitchen light, each ending at the first steam-off.',deliverables:['6 reels (15–30s)','6 original recipes with photography','Usage licensing for digital'],results:'Campaign metrics shared on enquiry.'},
  {id:'p2',slug:'anveshan-first-press-ritual',title:'The First-Press Ritual',brand:'Anveshan',cat:'Food Photography',format:'Still campaign',type:'Paid partnership',year:2025,status:'published',featured:true,seed:'anveshan-oil-ritual-pour',
   brief:'A still-life series honouring cold-pressed oils as a craft ingredient rather than a commodity.',role:'Creative direction, photography, recipe notes',concept:'Slow pours, raw ingredients and morning shadow — oil as the first act of every recipe.',deliverables:['12 still images','3 recipe cards','Art-direction guidelines'],results:''},
  {id:'p3',slug:'masterchow-street-wok-home-fire',title:'Street Wok, Home Fire',brand:'MasterChow',cat:'Reels & Video',format:'Reel series',type:'Paid partnership',year:2024,status:'published',featured:true,seed:'masterchow-wok-flame-street',
   brief:"Bring street-side Indo-Chinese fire into home kitchens with the brand's sauces.",role:'Concept, recipe development, production',concept:'High-heat, high-sound reels: the roar of the wok as the signature motif.',deliverables:['4 reels','4 recipes','Cut-downs for paid social'],results:''},
  {id:'p4',slug:'kapiva-wellness-tasted',title:'Wellness, Tasted',brand:'Kapiva',cat:'Branded Content',format:'Integrated recipe film',type:'Paid partnership',year:2024,status:'published',featured:false,seed:'kapiva-wellness-morning-glass',
   brief:'Integrate a wellness ingredient into genuinely desirable daily ritual — no medicinal framing.',role:'Recipe development, storytelling script',concept:'A morning routine told in close-up, the product appearing as naturally as the kettle.',deliverables:['1 hero film','2 supporting posts'],results:''},
  {id:'p5',slug:'cookme-twenty-minute-pantry',title:'The 20-Minute Pantry',brand:'Cookme',cat:'UGC Production',format:'UGC video pack',type:'UGC commission',year:2025,status:'published',featured:false,seed:'cookme-pantry-shelf-jars',
   brief:"A UGC batch of pantry-first dinners for the brand's own ad channels.",role:'UGC creator — scripting, filming, editing',concept:'Honest, handheld, timer-on-screen dinners built from shelf staples.',deliverables:['6 UGC videos','2 ad hooks','Raw footage pack'],results:''},
  {id:'p6',slug:'kilrr-spice-tin-diaries',title:'The Spice Tin Diaries',brand:'KILRR',cat:'Food Photography',format:'Content photography',type:'Gifted collaboration',year:2024,status:'published',featured:false,seed:'kilrr-spice-tins-flatlay',
   brief:'An organic, gifted collaboration around heritage spice tins and the memories they carry.',role:'Photography, written vignettes',concept:'Open tins as time capsules — each spice paired with a one-paragraph family memory.',deliverables:['8 photographs','8 micro-essays'],results:''},
  {id:'p7',slug:'partition-plates',title:'Partition Plates',brand:'Independent',cat:'Personal Projects',format:'Ongoing editorial series',type:'Independent work',year:2023,status:'published',featured:true,seed:'partition-plates-thali-heritage',
   brief:'A self-initiated series documenting recipes that crossed borders in 1947, told through the families who carried them.',role:'Research, photography, interviews, writing',concept:'Every plate photographed twice — as it was remembered, and as it is cooked now.',deliverables:['Ongoing photo essays','Oral-history recipe archive'],results:''}
 ],
 brands:['Fortune','Nutralite','MasterChow','Anveshan','Kapiva','KILRR','Cookme','Sandu Pharma'],
 courses:[
  {id:'c1',title:'Baking Fundamentals',level:'Beginner',dur:'6 modules · ~4 hrs',status:'concept',blurb:'Ratio over recipe: doughs, batters, ovens and the confidence to improvise.'},
  {id:'c2',title:'Everyday Indian Cooking',level:'Beginner–Intermediate',dur:'8 modules · ~6 hrs',status:'concept',blurb:'The weekday grammar of Indian food — tempering, gravies, dals and rice.'},
  {id:'c3',title:'Bengali Classics',level:'Intermediate',dur:'6 modules · ~5 hrs',status:'concept',blurb:'Shorshe, posto, jaggery and smoke — the canon, taught properly.'},
  {id:'c4',title:'Food Styling for Creators',level:'All levels',dur:'5 modules · ~3 hrs',status:'concept',blurb:'Light, composition and honest styling for reels and stills.'},
  {id:'c5',title:'Desserts & Celebration Baking',level:'Intermediate',dur:'7 modules · ~5 hrs',status:'concept',blurb:'Festive centrepieces from mishti doi cheesecake to layered payesh.'}
 ],
 enquiries:[],
 subscribers:[],
 media:[
  {id:'m1',seed:'antara-hero-kitchen-light',alt:'Antara at the kitchen counter in directional morning light'},
  {id:'m2',seed:'antara-portrait-apron-flour',alt:'Portrait of Antara in her studio kitchen'},
  {id:'m3',seed:'shorshe-ilish-monsoon-curry',alt:'Shorshe ilish in a brass dish'},
  {id:'m4',seed:'mishti-doi-cheesecake-slice',alt:'Slice of mishti doi cheesecake'},
  {id:'m5',seed:'spice-market-cards-assorted',alt:'Assorted spices arranged like a colour study'},
  {id:'m6',seed:'monsoon-kitchen-window-rain',alt:'Rain on the kitchen window during monsoon'},
  {id:'m7',seed:'hands-mise-en-place-prep',alt:'Hands during mise en place'},
  {id:'m8',seed:'pantry-amber-jars-light',alt:'Amber jars in the pantry, soft light'}
 ],
 audit:[{ts:now,user:'system',action:'Studio content installed'} ]}
}
DB=loadDB();
(function migrate30(){if(DB.mig30)return;const s=DB.settings;
 if(!s.location||/Kolkata/i.test(s.location))s.location='Bangalore, India';
 if(s.email==='studio@antara.food')s.email='';
 if(!s.instagram||s.instagram==='@antara.cooks')s.instagram='@artisan.antara';
 if(s.formKey==null)s.formKey='';
 DB.pages.home.live=homeSections();DB.pages.home.draft=clone(DB.pages.home.live);DB.pages.home.dirty=false;
 DB.recipes.forEach(r=>{if(/^r\d$/.test(r.id)){r.status='draft';r.featured=false}});
 DB.users=[];DB.enquiries=(DB.enquiries||[]).filter(e=>!['e1','e2'].includes(e.id));DB.subscribers=(DB.subscribers||[]).filter(x=>!/^u\d$/.test(x.id));
 DB.audit=(DB.audit||[]).filter(a=>!/@studio\.com/.test(a.user));
 if(!DB.services)DB.services=clone(SERVICES_DEFAULT);
 DB.mig30=1;DB.audit.unshift({ts:Date.now(),user:'system',action:'Applied review fixes: new homepage order, Bangalore positioning, sample data removed'});save()})();
if(!DB.services)DB.services=clone(SERVICES_DEFAULT);
if(!DB.pages.home.draft)DB.pages.home.draft=clone(DB.pages.home.live);
if(!DB.pages.home.trash)DB.pages.home.trash=[];
/* Instagram import: adds reel recipes, new partner brands and the real handle — once per sync, never overwriting Antara's edits */
(function importWork(){
 if(DB.workImport==='2026-10-30')return;
 const first=!DB.workImport;
 if(first)DB.projects.forEach(x=>{if(/^p\d$/.test(x.id)){x.status='draft';x.featured=false}});
 WORK_PROJECTS.slice().reverse().forEach(w=>{if(DB.projects.some(x=>x.id===w.id))return;
  const ms=w.media.map(c=>REELS.find(r=>r.c===c)||EXTRA.find(r=>r.c===c)).filter(Boolean);
  DB.projects.unshift({...w,status:'published',seed:'reel:'+w.media[0],deliverables:ms.map(m=>m.t),results:''})});
 const home=[DB.pages.home.live,DB.pages.home.draft].flatMap(a=>a||[]).filter(s=>s.key==='work');
 home.forEach(s=>{if(s.f.sub==='Recipe development, photography, film and branded content — a curated selection.')s.f.sub='Brand partnerships, recipe series and festival food — chosen from two years of posts by what people actually watched, saved and cooked.'});
 DB.workImport='2026-10-30';
 DB.audit.unshift({ts:Date.now(),user:'system',action:`Built ${WORK_PROJECTS.length} Selected Work projects from Instagram posts (placeholder projects moved to drafts)`});
 save();
})();
(function importReels(){
 DB.reelHidden=DB.reelHidden||[];
 if(DB.reelImport===REEL_SYNC)return;
 const first=!DB.reelImport;let added=0;
 REEL_RECIPES.forEach(r=>{if(DB.recipes.some(x=>x.reel===r.reel))return;
  let slug=slugify(r.title);while(DB.recipes.some(x=>x.slug===slug))slug+='-reel';
  DB.recipes.push({id:'rr_'+r.reel,slug,title:r.title,cat:r.cat,prep:'—',cook:'—',serves:'—',status:'published',featured:false,date:Date.parse(r.date),seed:'reel:'+r.reel,excerpt:r.excerpt,ingredients:r.ingredients,steps:r.steps,reel:r.reel,video:''});added++});
 if(first){DB.recipes.forEach(x=>{if(/^r\d$/.test(x.id))x.featured=false});
  DB.recipes.filter(x=>x.reel).sort((a,b)=>reelBy(b.reel).v-reelBy(a.reel).v).slice(0,3).forEach(x=>x.featured=true)}
 ['Bazana','Prasuma','Carryhome'].forEach(b=>{if(!DB.brands.includes(b))DB.brands.push(b)});
 if(!DB.settings.instagram||DB.settings.instagram==='@antara.cooks')DB.settings.instagram='@'+REEL_HANDLE;
 DB.reelImport=REEL_SYNC;
 DB.audit.unshift({ts:Date.now(),user:'system',action:`Imported ${REELS.length} Instagram reels from @${REEL_HANDLE} (${added} recipes added)`});
 save();
})();

function getSession(){if(MODE!=='studio')return null;try{const s=JSON.parse(localStorage.getItem(SKEY));if(s&&s.exp>Date.now())return s}catch(e){} localStorage.removeItem(SKEY);return null}
function setSession(s){localStorage.setItem(SKEY,JSON.stringify(s))}
const PERMS={super:['overview','recipes','projects','pages','media','enquiries','subscribers','design','audit','settings','reels'],
 editor:['overview','recipes','projects','media','audit','reels']};
function can(mod){const s=getSession();return s&&PERMS[s.role]?.includes(mod)}
function audit(a){DB.audit.unshift({ts:Date.now(),user:getSession()?.email||'system',action:a});DB.audit=DB.audit.slice(0,120);save()}

/* ================= UI PRIMITIVES ================= */
function toast(msg,type=''){if(type==='err'){const a=$('#alerts');if(a){a.textContent='';setTimeout(()=>a.textContent=msg,30)}}const t=document.createElement('div');t.className='toast '+type;t.textContent=msg;$('#toasts').appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400)},3400)}
const FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
let trapEl=null,trapReturn=null;
function trapOn(el,opener){if(trapEl!==el){trapReturn=opener||document.activeElement}trapEl=el;
 ['#app','.skip','#mnav','#modal','#drawer'].forEach(s=>{const n=$(s);if(n&&n!==el&&!n.contains(el))n.inert=true});el.inert=false}
function trapOff(el){if(trapEl!==el)return;trapEl=null;['#app','.skip','#modal','#drawer'].forEach(s=>{const n=$(s);if(n)n.inert=false});
 const r=trapReturn;trapReturn=null;if(r&&document.contains(r))r.focus({preventScroll:true})}
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!trapEl)return;const f=[...trapEl.querySelectorAll(FOCUSABLE)].filter(x=>x.offsetParent!==null||x===document.activeElement);if(!f.length)return;
 const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
function openModal(html,wide=false){const m=$('#modal');m.innerHTML=`<div class="modal-box ${wide?'wide':''}">${html}</div>`;m.classList.add('open');hrefFix(m);trapOn(m,reelReturn||document.activeElement);
 if(!m.contains(document.activeElement))setTimeout(()=>(m.querySelector('[data-close],[data-cok]')||m.querySelector(FOCUSABLE))?.focus(),40)}
function closeModal(){const m=$('#modal');if(!m.classList.contains('open'))return;m.classList.remove('open');m.innerHTML='';m.removeAttribute('aria-label');reelReturn=null;trapOff(m)}
function confirmBox(title,msg,ok='Confirm',danger=false){return new Promise(res=>{
 openModal(`<h3>${esc(title)}</h3><p style="color:var(--ink2);font-size:.94rem">${esc(msg)}</p>
 <div class="m-actions"><button class="abtn" data-close>Cancel</button><button class="abtn ${danger?'danger':'pri'}" data-cok>${ok}</button></div>`);
 $('#modal [data-cok]').onclick=()=>{closeModal();res(true)};
 $('#modal [data-close]').onclick=()=>{closeModal();res(false)};})}
function openDrawer(html){const d=$('#drawer');if(!d)return;d.innerHTML=html;d.classList.add('open')}
function closeDrawer(){const d=$('#drawer');if(d)d.classList.remove('open')}

const FONT_D={Fraunces:"'Fraunces',serif"};
const FONT_B={Manrope:"'Manrope',sans-serif"};
const ACC={burg:'#682F3B',olive:'#777C62',terra:'#B87960',cocoa:'#6B4A3B'};
function applyTokens(){const t=DB.tokens;document.documentElement.dataset.theme=t.theme;
 document.documentElement.style.setProperty('--ff-d',FONT_D[t.display]||FONT_D.Fraunces);
 document.documentElement.style.setProperty('--ff-b',FONT_B[t.body]||FONT_B.Manrope);
 document.documentElement.style.setProperty('--accent',ACC[t.accent]);
 document.documentElement.style.setProperty('--rad',t.radius+'px')}
applyTokens();

/* ================= ROUTER ================= */
function currentRoute(){if(ROUTING==='path'){let p=decodeURIComponent(location.pathname);if(BASE&&p.startsWith(BASE))p=p.slice(BASE.length);p=p.replace(/\/index\.html$/,'').replace(/\/+$/,'')||'/';return{path:p,query:new URLSearchParams(location.search.slice(1))}}
 const raw=(location.hash||'#/').slice(1);const [p,q]=raw.split('?');return{path:(p.replace(/\/+$/,'')||'/'),query:new URLSearchParams(q||'')}}
let firstLoad=true;
function route(){const {path,query}=currentRoute();
 const render=()=>{ if(path.startsWith('/admin')&&MODE==='studio'){renderAdmin(path)}else{renderSite(path,query)} initReveals(); };
 if(firstLoad||reduced){render();firstLoad=false;window.scrollTo(0,0);return}
 const v=$('#veil');v.classList.add('show');setTimeout(()=>{render();window.scrollTo(0,0);setTimeout(()=>v.classList.remove('show'),60)},280)}
window.addEventListener('hashchange',()=>{if(ROUTING==='hash'&&location.hash.startsWith('#/'))route()});
window.addEventListener('popstate',()=>{if(ROUTING==='path')route()});

/* ================= MOTION ================= */
let io;
function initReveals(){
 if(reduced){$$('[data-reveal],[data-mask],.lm').forEach(el=>el.classList.add('in'));return}
 if(io)io.disconnect();
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.hasAttribute('data-scramble'))scramble(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 $$('[data-reveal],[data-mask],.lm').forEach(el=>io.observe(el));
}
const CH='◆◇·—AKMSTB*';
function scramble(el){if(reduced)return;const orig=el.dataset.text||el.textContent;el.dataset.text=orig;let f=0;const t=setInterval(()=>{el.textContent=orig.split('').map((c,i)=>i<f?c:(c===' '?' ':CH[Math.random()*CH.length|0])).join('');f+=Math.ceil(orig.length/14);if(f>orig.length){clearInterval(t);el.textContent=orig}},34)}
let ticking=false;
window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;
 const y=window.scrollY;const h=$('#hdr');if(h)h.classList.toggle('scrolled',y>10);
 const pb=$('#progress');if(pb){const max=document.documentElement.scrollHeight-innerHeight;pb.style.transform=`scaleX(${max>0?Math.min(y/max,1):0})`}
 const tt=$('#to-top');if(tt)tt.classList.toggle('show',y>innerHeight*1.2);
 if(!reduced)$$('[data-parallax]').forEach(el=>{const r=el.getBoundingClientRect();const off=(r.top+r.height/2-innerHeight/2)*parseFloat(el.dataset.parallax);el.style.transform=`translate3d(0,${off}px,0)`})})},{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDrawer();menuSet(false)}
 if($('#modal .reel-lb')&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){const n=reelIdx+(e.key==='ArrowRight'?1:-1);if(n>=0&&n<reelSeq.length)openReel(reelSeq[n],reelSeq)}
 if((e.key===' '||e.key==='Enter')&&e.target.matches('.ings li')){e.preventDefault();e.target.click()}});
function menuSet(open){const mn=$('#mnav'),mb=$('.menu-btn');if(!open&&!mn.classList.contains('open'))return;if(mb)mb.setAttribute('aria-expanded',open);mn.classList.toggle('open',open);mn.inert=!open;document.body.style.overflow=open?'hidden':'';
 if(open){trapOn(mn,mb);setTimeout(()=>mn.querySelector('.close')?.focus(),80)}else trapOff(mn);
 if(open)$$('.mnav a.big').forEach((a,i)=>a.style.transitionDelay=(.08+i*.06)+'s')}

/* ================= SHARED PARTIALS ================= */
function headerHTML(active){
 const nav=[['#/work','Work'],['#/recipes','Recipes'],['#/about','About'],['#/reels','Reels']];
 return `<header class="hdr" id="hdr">
 <a class="wordmark" href="#/" aria-label="Antara — home">Antara<span class="dot">.</span><em>studio</em></a>
 <nav class="hdr-nav" aria-label="Primary">${nav.map(([h,l])=>`<a href="${h}" class="${active===h?'on':''}">${l}</a>`).join('')}</nav>
 <div class="hdr-right">
   <a class="ig-mini" href="${IGURL()}" target="_blank" rel="noopener" aria-label="Instagram ${esc(DB.settings.instagram)}">IG ↗</a>
   <a class="btn sm" href="#/collaborate">Plan a collaboration</a>
   <button class="menu-btn" data-action="menu-open" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button>
 </div></header>`}
function footerHTML(){const s=DB.settings;
 return `<footer class="ftr"><div class="ftr-mark" aria-hidden="true">Antara</div>
 <div class="ftr-grid">
  <div><div class="ftr-sig">${esc(s.signature)}</div><p style="font-size:.88rem;max-width:36ch">Recipes, films and photographs from a home kitchen in Bangalore — rooted in Bengal, and the collaborations they have started.</p></div>
  <div><h4>Explore</h4><a class="fl" href="#/work">Work</a><a class="fl" href="#/recipes">Recipes</a><a class="fl" href="#/about">About</a><a class="fl" href="#/collaborate">Collaborate</a><a class="fl" href="#/reels">Reels</a></div>
  <div><h4>Elsewhere</h4><a class="fl" href="${IGURL()}" target="_blank" rel="noopener">Instagram ${esc(s.instagram)} ↗</a>${s.email?`<a class="fl" href="mailto:${esc(s.email)}">${esc(s.email)}</a>`:''}<a class="fl" href="#/pantry">The Pantry · coming soon</a><a class="fl" href="#/academy">Kitchen Academy · coming soon</a></div>
  <div><h4>The Sunday Note</h4><p style="font-size:.85rem;margin-bottom:14px">One recipe, one story — occasionally.</p>
  <form class="nl-mini" data-form="newsletter" novalidate><label class="sr-only" for="nl-foot">Email address</label><input id="nl-foot" type="email" name="email" placeholder="your@email.com" autocomplete="email" required><button type="submit">Join</button></form>
  <p class="fineprint" style="margin-top:8px">By joining you agree to occasional emails. Unsubscribe anytime · <a href="#/privacy" style="text-decoration:underline">Privacy</a></p></div>
 </div>
 <div class="ftr-bottom"><span>© 2026 Antara · ${esc(s.location)}</span><span><a href="#/privacy">Privacy &amp; cookies</a></span>${MODE==='studio'?'<span><a href="#/admin/overview">Studio</a></span>':'<span>Food. Creativity. Connection.</span>'}</div>
 </footer>`}
function kicker(k){return `<div class="kicker" data-scramble>${esc(k)}</div>`}
function ticker(){const items=['gondhoraj lebu','posto','khejur gur','panch phoron','ghee','ilish','cardamom','bhaja masala','nolen gur','radhuni','smoked salt','mishti doi'];
 const s=items.map(i=>`<span>${i} <b>·</b></span>`).join('');return `<div class="ticker" aria-hidden="true"><div class="ticker-track">${s}${s}</div></div>`}
const CATS=['Everyday Cooking','Bengali & Regional','Baking & Desserts','Celebrations','Quick & Easy','Global Flavours'];
const WORK_CATS=['Brand Collaborations','Recipe Development','Food Photography','Reels & Video','Seasonal Campaigns','Personal Projects'];

/* ================= SECTION RENDERERS ================= */
function brandsWithReels(){return [...new Set(visReels().filter(r=>r.b).map(r=>r.b))]}
function secHero(s){const st=reelStats(),latest=visReels().slice().sort((a,b)=>b.d.localeCompare(a.d))[0];
 return `<section class="hero"><div class="wrap" style="width:100%"><div class="hero-grid">
 <div class="hero-copy"><div class="lm"><span>${kicker(s.kicker)}</span></div>
 <h1><span class="lm"><span>${esc(s.h1a)}</span></span><span class="lm"><span><em>${esc(s.h1b)}</em></span></span></h1>
 <p class="sub" data-reveal>${esc(s.sub)}</p>
 <div class="hero-ctas" data-reveal><a class="btn solid" href="${esc(s.href1)}">${esc(s.cta1)} <span class="ar">→</span></a><a class="btn" href="${esc(s.href2)}">${esc(s.cta2)}</a></div>
 <ul class="hero-proof" data-reveal aria-label="At a glance">${PROFILE.verified?'<li><span class="vf" aria-hidden="true">✓</span>Verified creator</li>':''}<li><b>${fmtN(PROFILE.followers)}</b> followers</li><li><b>${fmtN(st.v)}</b> plays · latest ${st.n} reels</li><li><b>${brandsWithReels().length}</b> brand partners</li></ul></div>
 <div class="hero-imgs"><figure class="hero-fig" data-mask>${img('portrait',900,1150,'Antara in a yellow silk saree, holding a brass plate of luchi and cholar dal','fetchpriority="high" loading="eager"').replace('loading="lazy" ','')}</figure>
 <figure class="hero-side" data-parallax="-0.06" aria-hidden="true">${img('reel:DdjdadYTNvT',420,520,'')}</figure>
 ${latest?`<a class="hero-tag" href="#/reels">Latest reel — ${esc(latest.t)}</a>`:''}
 <svg class="badge" viewBox="0 0 120 120" aria-hidden="true"><circle class="disc" cx="60" cy="60" r="59"/><defs><path id="bc" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs><text><textPath href="#bc">made with intention · shared with love · </textPath></text><circle cx="60" cy="60" r="4"/></svg>
 <div class="hero-figcap"><span>Luchi &amp; cholar dal</span><span>From her Pujo reel, Oct 2026</span></div></div></div>
 <div class="hero-base"><a class="scroll-cue" href="#main-start" data-action="scroll-next">Scroll <i></i></a><span>12.97° N · 77.59° E — a home kitchen in Bangalore</span><span data-scramble>Rooted in Bengal</span></div></div></section><span id="main-start"></span>${ticker()}`}
function factsRow(){return `<ul class="facts-row" data-reveal><li>Based in Bangalore · Bengali roots</li><li>Writes in English &amp; Bengali</li><li>${Math.floor(PROFILE.posts/10)*10}+ posts on Instagram</li><li>${brandsWithReels().length} brand partners</li></ul>`}
function secIntro(s){const ps=(s.body||'').split('\n\n');
 return `<section class="sec"><div class="wrap"><div class="intro-grid">
 <div class="intro-fig" data-mask><div class="frame">${img('reel:DYSHGXjkyom',760,950,'Antara at a Rajasthani thali lunch')}</div><div class="stamp">cook ·<br>storyteller</div></div>
 <div class="intro-txt">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2>
 ${ps.map((p,i)=>`<p data-reveal class="${i===0?'dropcap':''}" style="margin-top:22px">${esc(p)}</p>`).join('')}
 ${s.quote?`<p class="intro-quote" data-reveal>“${esc(s.quote)}”</p>`:''}
 ${factsRow()}
 <p data-reveal style="margin-top:30px"><a class="tlink" href="${esc(s.href)}">${esc(s.cta)} <span>→</span></a></p></div></div></div></section>`}
function adTag(r){return r.p||/(^|\s)#ad\b/i.test(r.cap||'')||/paid partnership/i.test(r.cap||'')}
function disclosure(r){return r&&r.b?(adTag(r)?'Paid partnership · #ad':'Brand collaboration'):''}
function projDisclosure(p){const all=(p.media||[]).map(mediaBy).filter(Boolean),ms=all.filter(x=>x.b);if(!ms.length)return /brand/i.test(p.type||'')?'Brand collaboration':'Independent — not sponsored';
 if(ms.length<all.length)return `Own series · includes ${ms.length} brand ${ms.length>1?'reels':'reel'}, labelled`;
 const n=ms.filter(adTag).length;return n===ms.length?'Paid partnership · #ad':n?'Mixed — each reel labelled':'Brand collaboration'}
function workCard(p,i,big){return `<a class="wcard ${big?'sp7':'sp5'}" href="#/work/${p.slug}" data-reveal style="transition-delay:${(i%3)*.08}s">
 <div class="ph ${big?'ar-43':'ar-34'}">${pimg(p, big?980:760, big?735:1013, p.title+' — '+p.brand)}<span class="idx">Nº ${String(i+1).padStart(2,'0')}</span><span class="peek">Read the story <b>→</b></span></div>
 <div class="meta"><h3>${esc(p.title)}</h3><span class="tag">${esc(p.brand)} · ${esc(p.cat)}</span></div>${p.summary?`<p class="wsum">${esc(p.summary)}</p>`:''}<span class="disc-pill ${/Independent/.test(projDisclosure(p))?'own':''}">${esc(projDisclosure(p))}</span></a>`}
function secWork(s){const ps=DB.projects.filter(p=>p.status==='published'&&p.featured).slice(0,4);const pst=reelStats();
 return `<section class="sec sec-cream"><div class="wrap">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2>
 <p class="lead" data-reveal style="margin-top:20px">${esc(s.sub)}</p>
 <div class="work-grid">${ps.map((p,i)=>workCard(p,i,i%2===0)).join('')}</div>
 <p class="fineprint" style="margin-top:22px">Drawn from ${WORK_STATS.posts} posts on ${esc(DB.settings.instagram)} since ${fmtD(Date.parse(WORK_STATS.since))} · ${fmtN(pst.v)} plays across the last ${pst.n} reels.</p>
 <p data-reveal style="margin-top:46px"><a class="tlink" href="${esc(s.href)}">${esc(s.cta)} <span>→</span></a></p></div></section>`}
function logoMark(b){const src=(DB.brandLogos||{})[b];if(src)return `<span class="logomark has-logo"><img class="logo-img" src="${esc(src)}" alt="${esc(b)}"></span>`;
 const alt=['MasterChow','KILRR','Cookme','Sandu Pharma'];return `<span class="logomark ${alt.includes(b)?'m2':''}">${esc(b)}</span>`}
function caseRow(p){return `<div class="case"><div class="ph" data-mask>${pimg(p,900,760,p.title)}</div><div class="txt">
 <div class="mono">${esc(p.brand)} · ${esc(p.type)} · ${p.year}</div><h3 style="font-size:clamp(1.6rem,2.6vw,2.4rem);margin-top:14px" data-reveal>${esc(p.title)}</h3>
 <dl><dt>Brief</dt><dd>${esc(p.brief)}</dd><dt>Antara’s role</dt><dd>${esc(p.role)}</dd><dt>Format</dt><dd>${esc(p.format)}</dd><dt>Deliverables</dt><dd>${esc(p.deliverables.join(' · '))}</dd></dl>
 <p style="margin-top:22px"><a class="tlink" href="#/work/${p.slug}">Read the case study <span>→</span></a></p></div></div>`}
/* ---------- BRAND SHOWCASE ---------- */
const BRAND_LINKS={Cookme:'pr_cookme',MasterChow:'pr_masterchow'};
const WM_STYLE={MasterChow:'m2',KILRR:'m2',Cookme:'m2','Sandu Pharma':'m2',Bazana:'it',Carryhome:'it'};
function brandMark(b,cls=''){const src=(DB.brandLogos||{})[b];
 return src?`<span class="bmark has-logo ${cls}"><img src="${esc(src)}" alt="${esc(b)}"></span>`
  :`<span class="bmark ${cls}"><span class="wm ${WM_STYLE[b]||''}">${esc(b)}</span></span>`}
function brandData(){return DB.brands.map(b=>{const rs=visReels().filter(r=>r.b===b),v=rs.reduce((a,r)=>a+r.v,0),top=rs.slice().sort((x,y)=>y.v-x.v)[0];
 const pid=BRAND_LINKS[b]||(rs.length?'pr_spotlights':'');const pj=DB.projects.find(p=>p.id===pid&&p.status==='published');
 return{b,rs,v,top,n:rs.length,href:pj?'#/work/'+pj.slug:(top?'':'#/collaborate'),code:top?.c}}).sort((a,b)=>b.v-a.v||b.n-a.n)}
function brandShowcase(){const bd=brandData();const lead=bd[0];
 const tile=(d,i)=>{const tag=d.href?'a':'button';const attrs=d.href?`href="${d.href}"`:`data-action="reel-open" data-code="${d.code}"`;
  return `<${tag} class="bt ${i===0&&d.n?'bt-lead':''}" ${attrs} style="--d:${(i%4)*.06}s" data-reveal aria-label="${esc(d.b)}${d.n?`: ${d.n} ${d.n>1?'reels':'reel'}, ${fmtN(d.v)} plays`:''}">
  ${d.top?`<span class="bt-cover" aria-hidden="true"><img src="${REEL_COVERS[d.top.c]}" alt=""></span>`:''}
  ${i===0&&d.n?`<span class="bt-tag">Lead partner</span>`:''}
  <span class="bt-mark">${brandMark(d.b)}</span>
  ${i===0&&d.n>1?`<span class="bt-thumbs" aria-hidden="true">${d.rs.slice().sort((x,y)=>y.v-x.v).slice(0,4).map(r=>`<img src="${REEL_COVERS[r.c]}" alt="">`).join('')}</span>`:''}
  <span class="bt-meta">${d.n?`<b>${d.n} ${d.n>1?'reels':'reel'}</b><span>${fmtN(d.v)} plays</span>`:`<b>Partner</b><span>Collaboration</span>`}</span>${d.top?`<span class="bt-touch">Top reel: ${esc(d.top.t)}</span>`:''}
  ${d.top?`<span class="bt-hover"><em>${i===0&&d.n?'Most-watched with '+esc(d.b):'Top reel'}</em><strong>${esc(d.top.t)}</strong><span>${d.href?'See the work →':'Watch the reel ▶'}</span></span>`:''}
  </${tag}>`};
 const marks=bd.map(d=>`<li>${brandMark(d.b,'mq')}</li>`).join('');
 return `<div class="bmarquee" data-reveal aria-label="Brands Antara has worked with"><ul class="bm-track">${marks}${marks.replace(/<li>/g,'<li aria-hidden="true">')}</ul></div>
 <div class="bgrid">${bd.filter(d=>d.n).map(tile).join('')}</div>
 ${bd.some(d=>!d.n)?`<p class="b-also"><span class="mono">Also worked with</span>${bd.filter(d=>!d.n).map(d=>brandMark(d.b,'sm')).join('<i aria-hidden="true">✦</i>')}</p>`:''}`}
function whyAntara(){const st=reelStats(),med=median(visReels().map(r=>r.v)),bm=median(visReels().filter(r=>r.b).map(r=>r.v)),om=median(visReels().filter(r=>!r.b).map(r=>r.v));
 const big=visReels().filter(r=>r.v>=1e5).length;
 return `<div class="why" data-reveal><div class="why-grid">
 <div><b>${PROFILE.followers.toLocaleString('en-IN')}</b><span>followers on a verified Instagram account</span></div>
 <div><b>${fmtN(Math.round(med))}</b><span>median plays per reel — about ${Math.round(med/PROFILE.followers*100)}% of her following</span></div>
 <div><b>${fmtN(st.v)}</b><span>plays across her latest ${st.n} reels; ${big} passed 100K</span></div>
 <div><b>${bm>om?'+'+Math.round((bm/om-1)*100)+'%':Math.round((bm/om-1)*100)+'%'}</b><span>median plays on brand reels vs her own</span></div></div>
 <p class="fineprint">Public Instagram data for @${REEL_HANDLE}: plays and likes collected ${fmtD(Date.parse(REEL_SYNC))}, followers ${fmtD(Date.parse(PROFILE.asOf))}. Whether any reel was boosted is not verified. Saves, reach and audience demographics are shared in the media kit.</p></div>`}
function mediaKitCTA(){return `<div class="mk" data-reveal><div><h3>Request the media kit</h3><p>Audience profile, recent performance, formats, usage options and indicative collaboration packages.</p></div><a class="btn solid" href="#/collaborate?type=media-kit">Request media kit <span class="ar">→</span></a></div>`}
function secBrands(s){return `<section class="sec" id="proof"><div class="wrap">${kicker(s.kicker)}<h2 class="h2" data-reveal style="max-width:22ch">${esc(s.headline)}</h2>
 <p class="lead" data-reveal style="margin-top:20px">${esc(s.sub)}</p>
 ${whyAntara()}
 ${brandShowcase()}
 ${mediaKitCTA()}</div></section>`}
function secServices(s){const sv=DB.services||SERVICES_DEFAULT;return `<section class="sec sec-cream" id="services"><div class="wrap">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2>
 <p class="lead" data-reveal style="margin-top:20px">${esc(s.sub)}</p>
 <div class="svc-cards">${sv.map((x,i)=>`<div class="svc-card" data-reveal style="transition-delay:${(i%3)*.06}s"><span class="n">${String(i+1).padStart(2,'0')}</span><h3>${esc(x.n)}</h3><p>${esc(x.d)}</p><p class="lt"><span>Lead time</span>${esc(x.lead)}</p></div>`).join('')}</div>
 <p data-reveal style="margin-top:36px"><a class="tlink" href="${esc(s.href)}">${esc(s.cta)} <span>→</span></a></p></div></section>`}
function secNext(s){return `<section class="sec" id="next"><div class="wrap">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2><p class="lead" data-reveal style="margin-top:18px">${esc(s.sub)}</p>
 <div class="next-grid"><a class="next-card" href="#/pantry" data-reveal><span class="pill concept">Concept · no launch date</span><h3>The Pantry</h3><p>Small-batch products rooted in Bengal. Nothing is for sale yet.</p><span class="tlink">Read more →</span></a>
 <a class="next-card" href="#/academy" data-reveal><span class="pill concept">Concept · not enrolling</span><h3>The Kitchen Academy</h3><p>Courses in Bengali classics, everyday cooking and food styling — in development.</p><span class="tlink">Read more →</span></a>
 <div class="next-card nl" data-reveal><h3>The Sunday Note</h3><p>One recipe, one story — occasionally. Hear first when either chapter opens.</p>
 <form class="wait-form" data-form="newsletter" data-src="home" novalidate><div class="field"><label for="nl-home">Email address</label><input id="nl-home" type="email" name="email" autocomplete="email" placeholder="you@example.com" required></div>
 <label class="consent"><input type="checkbox" name="consent" required data-msg="Please tick to confirm you’re happy to receive emails."><span>I’m happy to receive occasional emails. Unsubscribe anytime. <a href="#/privacy" style="text-decoration:underline">Privacy</a></span></label>
 <button class="btn solid" type="submit" style="justify-self:start">Join the Sunday Note <span class="ar">→</span></button></form></div></div></div></section>`}
function secPhilosophy(s){return `<section class="sec sec-dark"><div class="wrap">
 <div class="phil-grid"><div class="phil-sticky">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2>
 <div class="phil-strip"><div class="ph" data-parallax="-0.04">${img('monsoon-kitchen-window-rain',420,560,'Rain on the kitchen window')}</div><div class="ph" data-parallax="0.05">${img('spice-market-cards-assorted',420,560,'Spiced tea with whole spices scattered around')}</div><div class="ph" data-parallax="-0.03">${img('hands-mise-en-place-prep',420,560,'Hands chopping herbs on a board')}</div></div></div>
 <div class="phil-flow"><p data-reveal>${esc(s.p1)}</p><p data-reveal>${esc(s.p2)}</p><p data-reveal>${esc(s.p3)}</p></div></div>
 <div class="phil-quote" data-reveal><p>“${esc(s.quote)}”</p><div class="mono" style="margin-top:18px">— Antara</div></div></div></section>`}
function rcard(r,i){const rv=r.reel?reelBy(r.reel):null;return `<a class="rcard sp4" href="#/recipes/${r.slug}" data-reveal style="transition-delay:${i*.07}s">
 <div class="ph">${img(r.seed,720,900,r.title)}<span class="cat">${esc(r.cat)}</span>${rv?`<span class="reel-dur">▶ ${fmtDur(rv.s)}</span>`:''}<span class="peek">View recipe <b>→</b></span></div>
 <h3>${esc(r.title)}</h3><div class="rmeta">${rv?`<span>▶ ${fmtN(rv.v)} plays</span><span>${r.ingredients.length} ingredients</span><span>Reel recipe</span>`:`<span>Prep ${esc(r.prep)}</span><span>Cook ${esc(r.cook)}</span><span>Serves ${esc(r.serves)}</span>`}</div></a>`}
function secRecipes(s){const rs=DB.recipes.filter(r=>r.status==='published').filter(r=>r.featured).slice(0,3);
 return `<section class="sec"><div class="wrap">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2>
 <p class="lead" data-reveal style="margin-top:20px">${esc(s.sub)}</p><div class="rec-grid">${rs.map(rcard).join('')}</div>
 <p data-reveal style="margin-top:46px"><a class="tlink" href="${esc(s.href)}">${esc(s.cta)} <span>→</span></a></p></div></section>`}
function waitForm(src,withInts){const id='wf-'+src;
 return `<form class="wait-form" data-form="waitlist" data-src="${src}" id="${id}" novalidate>
 <div class="field"><label for="${id}-e">Email address</label><input id="${id}-e" type="email" name="email" autocomplete="email" placeholder="you@example.com" required data-msg="Please add a valid email."></div>
 ${withInts?`<div class="field"><label>I’m curious about</label><div class="ints">${['Desserts','Baking','Pantry products','Culinary gifts'].map(x=>`<label><input type="checkbox" name="int" value="${x}"><span>${x}</span></label>`).join('')}</div></div>`:''}
 <label class="consent"><input type="checkbox" name="consent" required data-msg="Please tick to confirm you’re happy to receive emails."><span>I’m happy to receive launch updates by email. Unsubscribe anytime. <a href="#/privacy" style="text-decoration:underline">Privacy</a></span></label>
 <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
 <button class="btn solid" type="submit" style="justify-self:start">${src==='pantry'?'Be First to Know':'Join the Learning List'} <span class="ar">→</span></button>
 <div class="form-status" data-status aria-live="polite"></div></form>`}
function secPantry(s){return `<section class="sec sec-cream" id="pantry"><div class="wrap"><div class="pantry-grid">
 <div class="pantry-txt">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2><p class="lead" data-reveal style="margin-top:22px">${esc(s.sub)}</p>
 <div class="hints" data-reveal><div class="hint"><span class="n">HINT 01</span><p>Small-batch, first.</p></div><div class="hint"><span class="n">HINT 02</span><p>Rooted in Bengal, packed for anywhere.</p></div><div class="hint"><span class="n">HINT 03</span><p>Sweet things are involved.</p></div></div>
 ${waitForm('pantry',true)}<p class="fineprint" style="margin-top:14px">The Pantry is a working title — and nothing is for sale yet. That is the honest version.</p></div>
 <div class="pantry-fig" data-mask>${img('pantry-amber-jars-light',760,950,'A slice of tiramisu dusted with cocoa')}<div class="mono" style="margin-top:12px">Study for a label — not final packaging</div></div></div></div></section>`}
function secAcademy(s){return `<section class="sec" id="academy"><div class="wrap">${kicker(s.kicker)}<h2 class="h2" data-reveal>${esc(s.headline)}</h2>
 <p class="lead" data-reveal style="margin-top:20px">${esc(s.sub)}</p>
 <div style="margin-top:clamp(36px,4vw,56px)" data-reveal>${DB.courses.map((c,i)=>`<div class="course-row"><span class="cn">${String(i+1).padStart(2,'0')}</span><h3>${esc(c.title)}</h3><div class="cm"><span class="pill">${esc(c.level)}</span><span class="pill">${esc(c.dur)}</span><span class="pill concept">Concept — coming soon</span></div></div>`).join('')}</div>
 ${waitForm('academy',false)}</div></section>`}
function secInsta(s){const top=visReels().slice().sort((a,b)=>b.v-a.v).slice(0,6);return `<section class="sec sec-cream"><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap">
 <div>${kicker('08 · On Instagram')}<h2 class="h2" data-reveal>${esc(s.headline)}</h2><p class="lead" data-reveal style="margin-top:16px">${esc(s.sub)} Her most-loved reels, straight from ${esc(DB.settings.instagram)}.</p></div>
 <div class="hero-ctas" style="margin-top:0" data-reveal><a class="btn solid" href="#/reels">All ${visReels().length} reels <span class="ar">→</span></a><a class="btn" href="${IGURL()}" target="_blank" rel="noopener">Follow ↗</a></div></div>
 <div class="reel-row">${top.map((r,i)=>reelCard(r,i)).join('')}</div></div></section>`}
function secClosing(s){return `<section class="sec sec-burg close-band"><div class="close-bg" aria-hidden="true">${img('closing-thali',1600,900,'')}</div><div class="wrap">${kicker('06 · Collaborate')}
 <h2 class="h2" data-reveal>${esc(s.headline)}</h2><p class="sub" data-reveal style="margin-top:26px;color:#D9C6BB;max-width:52ch;font-size:1.05rem">${esc(s.sub)}</p>
 <div class="hero-ctas" data-reveal><a class="btn ghost-light" href="${esc(s.href1)}">${esc(s.cta1)} <span class="ar">→</span></a><a class="btn ghost-light" href="${esc(s.href2)}">${esc(s.cta2)}</a></div></div></section>`}
const SECRENDER={hero:secHero,intro:secIntro,work:secWork,brands:secBrands,services:secServices,next:secNext,philosophy:secPhilosophy,recipes:secRecipes,pantry:secPantry,academy:secAcademy,instagram:secInsta,closing:secClosing};
const LONGF=['sub','body','p1','p2','p3','quote','note'];

/* ================= PUBLIC PAGES ================= */
function renderSite(path,query){
 const sess=getSession();const draft=query.get('draft')==='1'&&sess;
 const secs=DB.pages.home.dirty&&draft?DB.pages.home.draft:DB.pages.home.live;
 let page='',meta={path,title:'Antara — Bengali Food Creator & Recipe Developer, Bangalore',desc:'Antara is a '+SITE.tagline+' — original recipes, food films, photography and campaigns for home cooks and food brands.',img:'default',crumbs:null,ld:null};
 const slug=path.split('/')[2];
 if(path==='/'){meta.ld=homeLD();
  page=(draft?`<div class="draft-banner">Draft preview — unpublished changes · <a href="#/admin/pages" style="text-decoration:underline">back to builder</a></div>`:'')+secs.filter(s=>s.visible).map(s=>SECRENDER[s.key]?SECRENDER[s.key](s.f):'').join('')}
 else if(path==='/about'){page=pageAbout();Object.assign(meta,{title:'About Antara — Bengali Food Creator in Bangalore',desc:'Who Antara is: a Bengali food creator and recipe developer in Bangalore, her focus, languages, partners and how she works with brands.',crumbs:[['About','/about']]})}
 else if(path==='/work'){page=pageWork();Object.assign(meta,{title:'Work — Brand Campaigns & Recipe Series | Antara',desc:'Brand partnerships, recipe series and seasonal campaigns by Antara, with the reels and public figures behind each project.',crumbs:[['Work','/work']]})}
 else if(path.startsWith('/work/')){page=pageWorkDetail(slug);const p=DB.projects.find(x=>x.slug===slug&&x.status==='published');
  if(p)Object.assign(meta,{title:`${p.title} — ${p.brand} | Antara`,desc:p.summary||p.brief,img:'work:'+p.slug,crumbs:[['Work','/work'],[p.title,path]],ld:{'@type':'CreativeWork',name:p.title,description:p.summary||p.brief,creator:{'@id':'#antara'},about:p.brand,dateCreated:String(p.year).slice(0,4)}});else meta.notFound=true}
 else if(path==='/recipes'){page=pageRecipes();Object.assign(meta,{title:'Recipes — Bengali & Everyday Cooking | Antara',desc:'Recipes from Antara’s most-watched reels, written out in full — Bengali classics, one-pot weeknight meals, festival food and more.',crumbs:[['Recipes','/recipes']]})}
 else if(path.startsWith('/recipes/')){page=pageRecipeDetail(slug);const r=DB.recipes.find(x=>x.slug===slug&&x.status==='published');
  if(r)Object.assign(meta,{title:`${r.title} Recipe | Antara`,desc:r.excerpt,img:'recipe:'+r.slug,crumbs:[['Recipes','/recipes'],[r.title,path]],ld:recipeLD(r)});else meta.notFound=true}
 else if(path==='/collaborate'){page=pageCollab(query);Object.assign(meta,{title:'Collaborate — Services for Food & Kitchen Brands | Antara',desc:'Sponsored recipe reels, recipe development, food photography, UGC and seasonal campaigns. Request Antara’s media kit or send a brief.',crumbs:[['Collaborate','/collaborate']]})}
 else if(path==='/reels'){page=pageReels();Object.assign(meta,{title:'Reels — Recipe Videos | Antara',desc:'Antara’s latest recipe reels from Instagram — filter by Bengali, vegetarian, festive, high-protein and more.',crumbs:[['Reels','/reels']]})}
 else if(path==='/pantry'){page=pagePantry();Object.assign(meta,{title:'The Pantry (coming soon) | Antara',desc:'A future small-batch product line rooted in Bengal. Nothing is for sale yet.',crumbs:[['The Pantry','/pantry']]})}
 else if(path==='/academy'){page=pageAcademy();Object.assign(meta,{title:'The Kitchen Academy (in development) | Antara',desc:'Planned cooking courses and workshops — concepts, not yet enrolling.',crumbs:[['Kitchen Academy','/academy']]})}
 else if(path==='/privacy'){page=pagePrivacy();Object.assign(meta,{title:'Privacy & Cookies | Antara',desc:'What this website collects, why, who processes it, how long it is kept and how to ask for deletion.',crumbs:[['Privacy','/privacy']]})}
 else meta.notFound=true;
 if(meta.notFound){page=`<section class="page-hero"><div class="wrap">${kicker('404')}<h1>This plate is empty.</h1><p style="margin-top:24px"><a class="btn" href="#/">Back to the kitchen</a></p></div></section>`;Object.assign(meta,{title:'Page not found | Antara',desc:'This page does not exist.',noindex:true,ld:null,crumbs:null})}
 $('#app').innerHTML=headerHTML(path.startsWith('/work')?'#/work':path.startsWith('/recipes')?'#/recipes':'#'+path)+
  `<div id="progress" aria-hidden="true"></div><main id="main" tabindex="-1">${page}</main>`+footerHTML()+`<button id="to-top" data-action="to-top" aria-label="Back to top">↑</button>`;
 hrefFix($('#app'));hrefFix($('#mnav'));
 if(!firstLoad)setTimeout(()=>$('#main')?.focus({preventScroll:true}),320);
 setMeta(meta);
 const ml=$('#mnav-mail');if(ml)ml.textContent=DB.settings.email||'';const mi=$('#mnav-ig');if(mi)mi.href=IGURL();const mlc=$('#mnav-loc');if(mlc)mlc.textContent=DB.settings.location;countUps();
 if(path==='/collaborate'&&query.get('type')==='media-kit')setTimeout(()=>{const f=$('#enq-form');if(f){f.scrollIntoView({block:'start',behavior:reduced?'auto':'smooth'});f.querySelector('input')?.focus({preventScroll:true})}},350);
}
/* ---------- SEO: per-route metadata and structured data ---------- */
function absURL(u){if(!u)return '';if(/^https?:/.test(u))return u;return SITE.url?SITE.url+(u.startsWith('/')?u:'/'+u):''}
function routeURL(p){return ROUTING==='path'||SITE.url?pathHref(p):'#'+p}
function setMeta(m){const h=document.head;
 const tag=(sel,make,attr,val)=>{let el=h.querySelector(sel);if(val==null||val===''){if(el)el.remove();return}if(!el){el=make();h.appendChild(el)}el.setAttribute(attr,val)};
 const meta=(k,v,prop)=>tag(`meta[${prop?'property':'name'}="${k}"]`,()=>{const e=document.createElement('meta');e.setAttribute(prop?'property':'name',k);return e},'content',v);
 document.title=m.title;meta('description',m.desc);meta('robots',m.noindex?'noindex':'');
 const canon=m.notFound?'':(SITE.url?SITE.url+pathHref(m.path):(ROUTING==='path'?pathHref(m.path):''));
 tag('link[rel=canonical]',()=>{const e=document.createElement('link');e.rel='canonical';return e},'href',canon);
 const ogi=typeof OG_IMAGES!=='undefined'?absURL(OG_IMAGES[m.img]||OG_IMAGES.default):'';
 meta('og:site_name','Antara',1);meta('og:type',m.path.startsWith('/recipes/')?'article':'website',1);meta('og:title',m.title,1);meta('og:description',m.desc,1);meta('og:url',SITE.url&&!m.notFound?SITE.url+pathHref(m.path):'',1);meta('og:image',ogi,1);meta('og:locale','en_IN',1);
 meta('twitter:card',ogi?'summary_large_image':'summary');meta('twitter:title',m.title);meta('twitter:description',m.desc);meta('twitter:image',ogi);
 h.querySelectorAll('script[data-ld]').forEach(n=>n.remove());
 const graph=[personLD()];if(m.ld)(Array.isArray(m.ld)?m.ld:[m.ld]).forEach(x=>graph.push(x));
 if(m.crumbs)graph.push({'@type':'BreadcrumbList',itemListElement:[['Home','/'],...m.crumbs].map(([n,p],i)=>({'@type':'ListItem',position:i+1,name:n,item:absURL(pathHref(p))||undefined}))});
 if(!m.notFound){const s=document.createElement('script');s.type='application/ld+json';s.dataset.ld='1';s.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});h.appendChild(s)}}
function personLD(){return{'@type':'Person','@id':'#antara',name:'Antara',jobTitle:'Food creator and recipe developer',description:SITE.tagline,url:SITE.url?SITE.url+'/':undefined,image:typeof OG_IMAGES!=='undefined'?absURL(OG_IMAGES.portrait||OG_IMAGES.default)||undefined:undefined,
 homeLocation:{'@type':'Place',name:'Bangalore, India'},knowsLanguage:['en','bn'],knowsAbout:['Bengali cuisine','Recipe development','Food photography','Food video'],sameAs:[IGURL()]}}
function homeLD(){return{'@type':'WebSite',name:'Antara',url:SITE.url?SITE.url+'/':undefined,inLanguage:'en-IN',publisher:{'@id':'#antara'}}}
const ISO_RX=/(\d+)\s*(h|hr|hrs|hour|hours|min|mins|minute|minutes)\b/gi;
function isoDur(t){if(!t||t==='—')return undefined;let h=0,mi=0;String(t).replace(ISO_RX,(_,n,u)=>{if(/^h/i.test(u))h+=+n;else mi+=+n});return h||mi?`PT${h?h+'H':''}${mi?mi+'M':''}`:undefined}
function recipeLD(r){const rv=r.reel?reelBy(r.reel):null,cover=typeof MEDIA_FILES!=='undefined'?absURL(MEDIA_FILES[r.reel]||''):'';
 return{'@type':'Recipe',name:r.title,description:r.excerpt,image:cover||undefined,author:{'@id':'#antara'},datePublished:new Date(r.date).toISOString().slice(0,10),
  prepTime:isoDur(r.prep),cookTime:isoDur(r.cook),recipeYield:r.serves&&r.serves!=='—'?r.serves:undefined,recipeCategory:r.cat,recipeCuisine:/Bengali/.test(r.cat)?'Bengali':'Indian',
  recipeIngredient:r.ingredients,recipeInstructions:r.steps.map(x=>({'@type':'HowToStep',text:x})),
  video:rv&&rv.c?{'@type':'VideoObject',name:r.title,description:r.excerpt,thumbnailUrl:cover||undefined,contentUrl:`https://www.instagram.com/reel/${r.reel}/`,embedUrl:`https://www.instagram.com/reel/${r.reel}/embed/`,uploadDate:rv.d,duration:rv.s?`PT${Math.floor(rv.s/60)}M${rv.s%60}S`:undefined}:undefined}}
function pageHero(k,h,lead){return `<section class="page-hero"><div class="wrap">${kicker(k)}<h1><span class="lm"><span>${h}</span></span></h1>${lead?`<p class="lead" data-reveal>${lead}</p>`:''}</div></section>`}
/* ---------- REELS PAGE ---------- */
const RF={cat:'',q:'',sort:'new',n:24};
function reelList(){let rs=visReels().filter(r=>!RF.cat||(RF.cat==='*'?r.b:r.g.includes(RF.cat)));
 if(RF.q){const q=RF.q.toLowerCase();rs=rs.filter(r=>(r.t+' '+(HEALTH_BRANDS.includes(r.b)?'':r.cap)+' '+r.b).toLowerCase().includes(q))}
 return rs.sort((a,b)=>RF.sort==='top'?b.v-a.v:RF.sort==='old'?a.d.localeCompare(b.d):b.d.localeCompare(a.d))}
function reelGridHTML(){const rs=reelList();if(!rs.length)return `<div class="empty" style="grid-column:1/-1">No reels match — try another dish or category.</div>`;
 return rs.slice(0,RF.n).map((r,i)=>reelCard(r,i)).join('')+(rs.length>RF.n?`<div class="more-wrap"><button class="btn" data-action="reel-more">Show more reels <span class="mono" style="color:inherit;margin-left:6px">${RF.n} of ${rs.length}</span></button></div>`:'')}
function pageReels(){const st=reelStats();
 return pageHero('From Instagram','Straight from <em>the reel.</em>',`Antara's latest ${st.n} reels from ${esc(DB.settings.instagram)} — weeknight recipes, festival food and the odd peek behind the camera. Tap any reel to watch it and read the recipe.`)+`
 <section class="sec" style="padding-top:40px"><div class="wrap">${reelProof()}
 <div class="reel-tools"><div class="chips" role="group" aria-label="Filter reels">${RCATS.map(([l,k])=>{const c=k===''?visReels().length:k==='*'?visReels().filter(r=>r.b).length:visReels().filter(r=>r.g.includes(k)).length;return c?`<button class="chip ${RF.cat===k?'on':''}" data-action="reel-cat" data-k="${k}" aria-pressed="${RF.cat===k}">${l} <span class="cnt">${c}</span></button>`:''}).join('')}</div>
 <div class="reel-search"><input type="search" placeholder="Search a dish, ingredient or brand…" value="${esc(RF.q)}" data-reel-q aria-label="Search reels"><select data-reel-sort aria-label="Sort reels"><option value="new" ${RF.sort==='new'?'selected':''}>Latest first</option><option value="top" ${RF.sort==='top'?'selected':''}>Most watched</option><option value="old" ${RF.sort==='old'?'selected':''}>Oldest first</option></select></div></div>
 <p class="mono" id="reel-count" aria-live="polite" style="margin:18px 0 0">${reelList().length} reels</p>
 <div class="reel-grid" id="reel-grid">${reelGridHTML()}</div></div></section>
 <section class="sec sec-burg close-band"><div class="wrap"><h2 class="h2" data-reveal>Want your product in the next one?</h2><div class="hero-ctas" data-reveal style="margin-top:34px"><a class="btn ghost-light" href="#/collaborate">Start a Conversation <span class="ar">→</span></a><a class="btn ghost-light" href="${IGURL()}" target="_blank" rel="noopener">Follow on Instagram ↗</a></div></div></section>`}
function refreshReels(){const g=$('#reel-grid');if(!g)return;g.innerHTML=reelGridHTML();$('#reel-count').textContent=reelList().length+' reels';initReveals()}
/* ---------- REEL LIGHTBOX ---------- */
let reelSeq=[],reelIdx=0,reelReturn=null;
function capHTML(t){t=String(t).replace(/\*\*|__|^#{1,3}\s+/gm,'').replace(/^\s*[*\-•]\s+/gm,'• ');return esc(t).replace(/#([\wঀ-৿]+)/g,'<span class="tag-h">#$1</span>').split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('')}
const HEALTH_BRANDS=['Kapiva'];
function openReel(code,seq){const r=mediaBy(code);if(!r)return;const kind=r.k==='photo'?'p':'reel';reelSeq=seq&&seq.length?seq:[code];reelIdx=Math.max(0,reelSeq.indexOf(code));
 const rec=DB.recipes.find(x=>x.reel===code&&x.status==='published');
 if(!reelReturn)reelReturn=document.activeElement;
 openModal(`<div class="reel-lb" role="document">
 <button class="lb-x" data-close aria-label="Close reel">✕</button><div class="lb-media"><img class="lb-poster" src="${REEL_COVERS[code]}" alt=""><iframe class="lb-frame" title="Instagram reel: ${esc(r.t)}" src="https://www.instagram.com/${kind}/${code}/embed/" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; clipboard-write" allowfullscreen scrolling="no"></iframe></div>
 <div class="lb-info"><div class="lb-top"><span class="mono">${fmtD(Date.parse(r.d))}${r.s?' · '+fmtDur(r.s):r.k==='photo'?' · Photo post':''}${r.o!==REEL_HANDLE?` · with @${esc(r.o)}`:''}</span><button class="abtn" data-close aria-label="Close">✕</button></div>
 <h3>${esc(r.t)}</h3>
 <div class="lb-stats">${r.v?`<span><b>${fmtN(r.v)}</b> plays</span>`:''}<span><b>${fmtN(r.l)}</b> likes</span><span><b>${r.m}</b> comments</span>${r.b?`<span class="pill concept">${esc(r.b)} · ${esc(disclosure(r))}</span>`:''}</div>
 <div class="lb-acts"><a class="btn sm solid" href="https://www.instagram.com/${kind}/${code}/" target="_blank" rel="noopener">Open on Instagram ↗</a>${rec?`<a class="btn sm" href="#/recipes/${rec.slug}">Full recipe →</a>`:''}</div>
 <div class="lb-cap">${HEALTH_BRANDS.includes(r.b)?`<p>This caption is not reproduced here because it contains product health claims made for the brand. You can read the original post on Instagram.</p>`:capHTML(r.cap)||'<p class="mono">No caption.</p>'}</div>
 ${reelSeq.length>1?`<div class="lb-nav"><button class="abtn" data-action="reel-step" data-d="-1" ${reelIdx===0?'disabled':''}>← Previous</button><span class="mono">${reelIdx+1} / ${reelSeq.length}</span><button class="abtn" data-action="reel-step" data-d="1" ${reelIdx===reelSeq.length-1?'disabled':''}>Next →</button></div>`:''}
 </div></div>`,true);
 $('#modal .modal-box').classList.add('reel-modal');$('#modal').setAttribute('aria-label','Reel: '+r.t);
 setTimeout(()=>$('#modal [data-close]')?.focus(),60)}
function countUps(){if(reduced)return;const els=$$('[data-count]');if(!els.length)return;
 const o=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;o.unobserve(e.target);const el=e.target,end=+el.dataset.count,t0=performance.now();
  const tick=t=>{const k=Math.min((t-t0)/1400,1),v=end*(1-Math.pow(1-k,3));el.textContent=fmtN(Math.round(v));if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}),{threshold:.6});els.forEach(e=>o.observe(e))}
function pageAbout(){return pageHero('About','The cook behind the camera.','Antara is a Bengali food creator, recipe developer and culinary storyteller based in Bangalore — endlessly curious about why we cook what we cook.')+`
 <section class="sec"><div class="wrap"><div class="abt-grid">
 <div class="abt-fig" data-mask>${img('portrait',800,1000,'Antara in a yellow silk saree, holding a brass plate of luchi and cholar dal')}</div>
 <div class="abt-txt" data-reveal><p class="dropcap" style="color:var(--ink2);font-size:1.05rem">I did not set out to be a food creator. I set out to keep recipes from disappearing — the kind that live in sound and smell, not in notebooks. Somewhere between the first photograph and the hundredth, that archival impulse turned into a practice: recipes, films and stories made with intention.</p>
 <p style="color:var(--ink2);margin-top:1.2em">Today that practice spans recipe development and branded content, an ongoing personal archive, and two chapters still being written — a product line and a small academy.</p></div></div>
 ${[['The cook','I cook the way I was taught — by instinct first, measurement second. My foundation is the Bengali home kitchen: mustard oil, posto, jaggery, and the discipline of not wasting anything. Everything else — baking, styling, the camera — was learned slowly, on purpose, plate by plate.'],
 ['The influences','Bengal gives me my grammar: the sequence of a meal, the insistence of the seasons, the way a single lemon can perfume a room. Modern kitchens give me my syntax — cleaner plating, sharper light, a global pantry. The conversation between the two is where my point of view lives.'],
 ['The work',"With brands, I act as a creative partner rather than a billboard: developing recipes that would survive without the brief, styling with restraint, and telling the product's story as honestly as my own. Paid, gifted or organic — every collaboration is labelled plainly."],
 ['The process','Every project starts away from the stove: reading, eating, listening. Then the testing begins — a dish is cooked until it stops performing and starts belonging. Only then does the camera come out.'],
 ['Beyond the kitchen','I collect spice tins, chase monsoon light with an unreasonable camera, and keep an unscientific record of every market I have ever visited. I am told this counts as a personality.']].map(([t,b],i)=>`
 <div class="chapter"><div class="cn">Chapter ${String(i+1).padStart(2,'0')}</div><div class="ct"><h3 data-reveal>${t}</h3><p data-reveal>${b}</p></div></div>`).join('')}
 <div class="facts" data-reveal><h3>At a glance</h3><dl>
 <div><dt>Based in</dt><dd>Bangalore, India · Bengali roots</dd></div>
 <div><dt>Focus</dt><dd>Bengali home cooking, one-pot weeknight meals, festival food, high-protein home-style recipes</dd></div>
 <div><dt>Languages</dt><dd>Writes in English and Bengali</dd></div>
 <div><dt>On Instagram</dt><dd><a href="${IGURL()}" target="_blank" rel="noopener">@${REEL_HANDLE}</a> — verified · ${PROFILE.followers.toLocaleString('en-IN')} followers · ${Math.floor(PROFILE.posts/10)*10}+ posts (as of ${fmtD(Date.parse(PROFILE.asOf))})</dd></div>
 <div><dt>Brand partners</dt><dd>${brandsWithReels().join(', ')}</dd></div>
 <div><dt>Works on</dt><dd>Recipe development, food video, food photography, styling, bilingual captions</dd></div></dl></div>
 <div class="pull" data-reveal>“I would rather cook one honest dish than ten impressive ones.”</div>
 <div data-reveal style="text-align:center"><a class="btn solid" href="#/collaborate">Work With Me <span class="ar">→</span></a></div></div></section>`}
function pageWorkDetailMedia(p,rel){const st=projStats(p),med=median(REELS.map(r=>r.v));
 const tiles=[st.v?[st.v,st.nv<st.n?`plays on the ${st.nv} ${st.nv>1?'reels':'reel'} with public play counts`:`plays across ${st.n} ${st.n>1?'reels':'reel'}`]:null,
  [st.l,'likes'],[st.n,st.m.some(x=>x.k==='photo')?'posts in the project':`${st.n>1?'pieces':'piece'} of content`],
  st.top?[st.top.v,`on one reel — ${st.top.t}`]:null].filter(Boolean);
 const dataLine=st.top&&st.top.v>med*3?`${esc(st.top.t)} reached ${fmtN(st.top.v)} plays — about ${Math.round(st.top.v/med)}× her typical reel (median ${fmtN(Math.round(med))}).`:'';
 return `<section style="padding:calc(var(--hdr) + 50px) 0 0"><div class="wrap">
 <div class="mono">${esc(p.type)} · ${esc(String(p.year))}</div><h1 style="font-size:clamp(2.4rem,5.6vw,4.6rem);margin-top:18px;max-width:20ch">${esc(p.title)}</h1>
 ${p.summary?`<p class="lead" data-reveal style="margin-top:22px">${esc(p.summary)}</p>`:''}
 <div class="cs-hero"><div class="ph">${projVisual(p)}</div>
 <div class="cs-meta">${[['Brand',p.brand],['Disclosure',projDisclosure(p)],['Discipline',p.cat],['Format',p.format],['Antara’s role',p.role]].map(([k,v])=>`<div class="mrow"><span class="mono" style="padding-top:3px">${k}</span><span style="font-size:.92rem">${esc(v)}</span></div>`).join('')}</div></div>
 <div class="proof" data-reveal style="grid-template-columns:repeat(${tiles.length},1fr)">${tiles.map(([n,l])=>`<div><b data-count="${n}">${fmtN(n)}</b><span>${esc(l)}</span></div>`).join('')}</div>
 <p class="fineprint" style="margin-top:10px">Source: public Instagram figures, collected ${fmtD(Date.parse(REEL_SYNC))}. Organic or boosted: not verified.${st.nv<st.n&&!st.m.every(x=>x.k==='photo')?' Instagram shows likes, not plays, for posts older than her latest 100 reels.':''}</p>
 ${[['Objective',`<p>${esc(p.brief)}</p>`],['Creative idea',`<p>${esc(p.concept)}</p>`],
   ['Deliverables',`<p>${esc(p.format)}: ${st.n} ${st.m.every(x=>x.k==='photo')?'posts':'pieces'} — tap any one to ${st.m.every(x=>x.k==='photo')?'view it':'watch it'} and read the caption.</p><div class="reel-row scroll ${st.m.every(x=>x.k==='photo')?'photos':''}" style="margin-top:18px">${st.m.map((r,i)=>reelCard(r,i)).join('')}</div>`],
   ['Measured result',`${dataLine?`<p class="data-line">${dataLine}</p>`:''}<p>${esc(p.insight||'')}</p><ul class="ev"><li><b>${st.v?fmtN(st.v)+' plays':'—'}</b> · ${fmtN(st.l)} likes · ${st.m.reduce((a,x)=>a+(x.m||0),0)} comments</li><li>Baseline: her median reel gets ${fmtN(Math.round(med))} plays</li><li>Saves, shares, watch time, clicks and code use are brand-confidential — shared in the media kit with permission</li><li>Data captured ${fmtD(Date.parse(REEL_SYNC))} from public Instagram counts</li></ul>`]].map(([k,b])=>`<div class="cs-block"><div class="lb">${kicker(k)}</div><div class="bd">${b}</div></div>`).join('')}
 ${rel.length?`<div class="cs-block"><div class="lb">${kicker('Related')}</div><div class="bd"><div class="work-grid" style="margin-top:0">${rel.map(r=>`<a class="wcard sp4" href="#/work/${r.slug}" data-reveal><div class="ph ar-34">${pimg(r,600,800,r.title)}</div><div class="meta"><h3 style="font-size:1.05rem">${esc(r.title)}</h3><span class="tag">${esc(r.brand)}</span></div></a>`).join('')}</div></div></div>`:''}
 <div style="padding:50px 0 80px"><a class="btn solid" href="#/collaborate">Create Something Together <span class="ar">→</span></a></div></div></section>`}
/* ---------- WHAT THE NUMBERS SAY ---------- */
function vbars(rows,key,fmt,label){const max=Math.max(...rows.map(r=>r[key]));const hi=rows.findIndex(r=>r[key]===max);
 return `<div class="vbars" role="img" aria-label="${esc(label)}: ${esc(rows.map(r=>r.k.replace(' *','')+' '+fmt(r[key])).join('; '))}">${rows.map((r,i)=>`<div class="vb ${i===hi?'hi':''}" tabindex="0" data-tip="${esc(r.k)} · ${fmt(r[key])} (${r.n} posts)"><span class="val">${fmt(r[key])}</span><span class="bar"><i style="height:${Math.max(2,r[key]/max*100)}%"></i></span><span class="lab">${esc(r.k)}</span></div>`).join('')}</div>`}
function hbars(rows,label){const max=Math.max(...rows.map(r=>r.v));
 return `<div class="hbars" role="img" aria-label="${esc(label)}: ${esc(rows.map(r=>r.k+' '+fmtN(r.v)).join('; '))}">${rows.map((r,i)=>`<div class="hb ${i===0?'hi':''}" tabindex="0" data-tip="${esc(r.k)} · ${fmtN(r.v)} plays · ${r.n} reels · median ${fmtN(Math.round(r.med))}"><span class="lab">${esc(r.k)}</span><span class="bar"><i style="width:${Math.max(1,r.v/max*100)}%"></i></span><span class="val">${fmtN(r.v)}</span></div>`).join('')}</div>`}
function tbl(head,rows){return `<details class="tbl"><summary>View as table</summary><table class="adm-t"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></details>`}
function secNumbers(){const G=WORK_STATS.growth,rs=REELS,lastG=G[G.length-1],prevG=G[G.length-3]||G[0];
 const labels=[['B','Bengali'],['C','Chicken & meat'],['F','Fish & seafood'],['V','Vegetarian'],['S','Sweets & baking'],['P','High-protein'],['T','Street food & snacks'],['G','Global'],['X','Festive']];
 const pil=labels.map(([k,l])=>{const xs=rs.filter(r=>r.g.includes(k)).map(r=>r.v);return{k:l,v:xs.reduce((a,b)=>a+b,0),n:xs.length,med:median(xs)}}).sort((a,b)=>b.v-a.v);
 const bm=median(rs.filter(r=>r.b).map(r=>r.v)),om=median(rs.filter(r=>!r.b).map(r=>r.v));
 const durs=[[0,45,'Under 45s'],[45,60,'45–60s'],[60,999,'Over 60s']].map(([a,b,l])=>({l,m:median(rs.filter(r=>r.s>=a&&r.s<b).map(r=>r.v))})).sort((a,b)=>b.m-a.m)[0];
 const lpp=rs.reduce((a,r)=>a+r.l,0)/rs.reduce((a,r)=>a+r.v,0)*100;
 return `<section class="sec sec-cream" id="numbers"><div class="wrap">${kicker('What the numbers say')}
 <h2 class="h2" data-reveal style="max-width:20ch">Her audience is growing — and it shows up for real food.</h2>
 <p class="lead" data-reveal style="margin-top:18px">An analysis of ${WORK_STATS.posts} posts (${WORK_STATS.videos} videos, ${WORK_STATS.carousels} photo posts) since ${fmtD(Date.parse(WORK_STATS.since))}, and play counts for her latest ${rs.length} reels.</p>
 <div class="charts">
  <figure class="chart" data-reveal><figcaption><b>Her best post went from ${fmtN(G[0].max)} to ${fmtN(Math.max(...G.map(g=>g.max)))} likes.</b><span>Most-liked post in each half-year</span></figcaption>${vbars(G,'max',fmtN,'Most-liked post per half-year')}${tbl(['Period','Posts','Most likes','Median likes'],G.map(g=>[esc(g.k),g.n,g.max.toLocaleString('en-IN'),g.med]))}</figure>
  <figure class="chart" data-reveal><figcaption><b>A typical post now earns ${Math.round(lastG.med/prevG.med*10)/10}× the likes it did a year ago.</b><span>Median likes per post in each half-year</span></figcaption>${vbars(G,'med',n=>String(n),'Median likes per post per half-year')}</figure>
 </div>
 <p class="fineprint" style="margin-top:8px">* ${esc(lastG.k.replace(' *',''))} covers July to October 2026 so far.</p>
 <div class="charts one">
  <figure class="chart" data-reveal><figcaption><b>${esc(pil[0].k)} and ${esc(pil[1].k.toLowerCase())} recipes draw the most plays.</b><span>Total plays by content theme, last ${rs.length} reels (a reel can sit in more than one theme)</span></figcaption>${hbars(pil,'Total plays by content theme')}${tbl(['Theme','Reels','Total plays','Median plays'],pil.map(p=>[esc(p.k),p.n,p.v.toLocaleString('en-IN'),Math.round(p.med).toLocaleString('en-IN')]))}</figure>
 </div>
 <div class="proof facts" data-reveal>
  <div><b>${bm>om?'+'+Math.round((bm/om-1)*100)+'%':Math.round((bm/om-1)*100)+'%'}</b><span>Brand reels reach ${bm>om?'more':'fewer'} people than her own — median ${fmtN(Math.round(bm))} vs ${fmtN(Math.round(om))} plays.</span></div>
  <div><b>${esc(durs.l)}</b><span>The reel length with the highest median plays (${fmtN(Math.round(durs.m))}).</span></div>
  <div><b>${lpp.toFixed(1)}%</b><span>Likes per play across her latest ${rs.length} reels.</span></div>
  <div><b>~${WORK_STATS.weekly}/week</b><span>Posting pace since May 2026 — steady, not bursty.</span></div>
 </div>
 <p class="fineprint" style="margin-top:10px">Source: public Instagram data for @${REEL_HANDLE}, collected ${fmtD(Date.parse(REEL_SYNC))}. Medians are used because a few viral reels skew averages.</p>
 </div></section>`}
function pageWork(){return pageHero('The Work','Stories, served beautifully.',`${DB.projects.filter(p=>p.status==='published').length} projects from two years on Instagram — brand partnerships, recipe series and seasonal work, each with the reels, photographs and numbers behind it. Every project is labelled by type: brand partnership or her own work.`)+`
 <section class="sec" style="padding-top:44px"><div class="wrap">
 <div class="chips" role="group" aria-label="Filter work"><button class="chip on" data-action="filter-work" data-f="All">All</button>${WORK_CATS.map(c=>`<button class="chip" data-action="filter-work" data-f="${esc(c)}">${esc(c)}</button>`).join('')}</div>
 <div class="work-grid" id="work-grid">${workGridHTML('All')}</div></div></section>
 ${secNumbers()}
 <section class="sec sec-burg close-band"><div class="wrap"><h2 class="h2" data-reveal>Have a brief worth cooking?</h2><div class="hero-ctas" data-reveal style="margin-top:34px"><a class="btn ghost-light" href="#/collaborate">Start a Conversation <span class="ar">→</span></a></div><p class="mono" style="margin-top:24px">Media kit &amp; rate card shared on enquiry.</p></div></section>`}
function workGridHTML(f){const ps=DB.projects.filter(p=>p.status==='published').filter(p=>f==='All'||p.cat===f||(f==='Brand Collaborations'&&/brand/i.test(p.type)));
 if(!ps.length)return `<div class="sp12"><div class="empty">Nothing plated here yet.</div></div>`;
 const span=i=>['sp7','sp5','sp4','sp8','sp6','sp6','sp5','sp7'][i%8];
 return ps.map((p,i)=>`<a class="wcard ${span(i)}" href="#/work/${p.slug}" data-reveal style="transition-delay:${(i%3)*.07}s"><div class="ph ${i%3===0?'ar-43':i%3===1?'ar-34':'ar-32'}">${pimg(p,900,i%3===1?1200:700,p.title)}<span class="idx">Nº ${String(i+1).padStart(2,'0')}</span></div><div class="meta"><h3>${esc(p.title)}</h3><span class="tag">${esc(p.brand)} · ${esc(p.cat)}</span></div>${p.summary?`<p class="wsum">${esc(p.summary)}</p>`:''}<span class="disc-pill ${/Independent/.test(projDisclosure(p))?'own':''}">${esc(projDisclosure(p))}</span></a>`).join('')}
function pageWorkDetail(slug){const p=DB.projects.find(x=>x.slug===slug&&x.status==='published');if(!p)return `<section class="page-hero"><div class="wrap"><h1>Case not found.</h1></div></section>`;
 const rel=DB.projects.filter(x=>x.status==='published'&&x.id!==p.id&&(x.cat===p.cat||x.featured)).slice(0,3);
 if(p.media&&p.media.length)return pageWorkDetailMedia(p,rel);
 return `<section style="padding:calc(var(--hdr) + 50px) 0 0"><div class="wrap">
 <div class="mono">${esc(p.type)} · ${p.year}</div><h1 style="font-size:clamp(2.4rem,5.6vw,4.6rem);margin-top:18px;max-width:20ch">${esc(p.title)}</h1>
 <div class="cs-hero"><div class="ph" data-mask>${img(p.seed,1200,750,p.title)}</div>
 <div class="cs-meta">${[['Brand',p.brand],['Discipline',p.cat],['Format',p.format],['Antara’s role',p.role]].map(([k,v])=>`<div class="mrow"><span class="mono" style="padding-top:3px">${k}</span><span style="font-size:.92rem">${esc(v)}</span></div>`).join('')}</div></div>
 ${[['The brief',`<p>${esc(p.brief)}</p>`],['Concept & approach',`<p>${esc(p.concept)}</p>`],['Deliverables',`<ul>${p.deliverables.map(d=>`<li>${esc(d)}</li>`).join('')}</ul>`],['Results',p.results?`<p>${esc(p.results)}</p>`:`<p>Outcome metrics are shared directly on enquiry — honest numbers only.</p>`]].map(([k,b])=>`<div class="cs-block"><div class="lb">${kicker(k)}</div><div class="bd">${b}</div></div>`).join('')}
 ${(()=>{const rs=visReels().filter(x=>x.b&&x.b.toLowerCase()===String(p.brand).toLowerCase());return rs.length?`<div class="cs-block"><div class="lb">${kicker('On Instagram')}</div><div class="bd"><p>${rs.length} ${rs.length>1?'reels':'reel'} made with ${esc(p.brand)} — ${fmtN(rs.reduce((a,r)=>a+r.v,0))} plays so far.</p><div class="reel-row scroll" style="margin-top:18px">${rs.map((r,i)=>reelCard(r,i)).join('')}</div></div></div>`:''})()}
 <div class="cs-block"><div class="lb">${kicker('Related')}</div><div class="bd"><div class="work-grid" style="margin-top:0">${rel.map(r=>`<a class="wcard sp4" href="#/work/${r.slug}" data-reveal><div class="ph ar-34">${pimg(r,600,800,r.title)}</div><div class="meta"><h3 style="font-size:1.05rem">${esc(r.title)}</h3><span class="tag">${esc(r.brand)}</span></div></a>`).join('')}</div></div></div>
 <div style="padding:50px 0 80px"><a class="btn solid" href="#/collaborate">Create Something Together <span class="ar">→</span></a></div></div></section>`}
function pageRecipes(){return pageHero('Recipes','From her kitchen.','Recipes from Antara’s most-watched reels, written out in full — Bengali classics, weeknight one-pot meals, festival food and more.')+`
 <section class="sec" style="padding-top:44px"><div class="wrap">
 <div class="chips"><button class="chip on" data-action="filter-rec" data-f="All">All</button>${CATS.map(c=>`<button class="chip" data-action="filter-rec" data-f="${esc(c)}">${esc(c)}</button>`).join('')}</div>
 <div class="rec-grid" id="rec-grid">${recGridHTML('All')}</div></div></section>`}
function recGridHTML(f){const rs=DB.recipes.filter(r=>r.status==='published').filter(r=>f==='All'||r.cat===f).sort((a,b)=>(b.reel?1:0)-(a.reel?1:0)||(b.reel?reelBy(b.reel).v-reelBy(a.reel).v:b.date-a.date));
 if(!rs.length)return `<div class="sp12"><div class="empty">Nothing published in this category yet.</div></div>`;
 return rs.map(rcard).join('')}
const ALLERGENS=[['Dairy',/\b(milk|curd|dahi|yog(h)?urt|cream|cheese|paneer|butter|ghee|khoya|mawa|malai|labneh)\b/i],['Egg',/\b(eggs?|mayonnaise)\b/i],['Tree nuts',/\b(cashews?|almonds?|pistachios?|walnuts?|kaju|badam)\b/i],['Peanuts',/\b(peanuts?|peanut butter|groundnut)\b/i],
 ['Gluten (wheat)',/\b(maida|atta|wheat|semolina|sooji|suji|rava|breadcrumbs?|bread|noodles|pasta|soy sauce|puff pastry)\b|(?<!rice |corn |gram |besan )\bflour\b/i],['Fish',/\b(fish|bhetki|pomfret|hilsa|ilish|rohu|katla)\b/i],['Shellfish',/\b(prawns?|shrimps?|chingri|crab)\b/i],['Soy',/\b(soya|soy)\b/i],['Sesame',/\b(sesame|til)\b/i],['Mustard',/\b(mustard|kasundi)\b/i]];
function allergenNote(r){const t=r.ingredients.join(' · ');const hit=ALLERGENS.filter(([,rx])=>rx.test(t)).map(([n])=>n);if(!hit.length)return '';
 return `<p class="allergen"><b>Contains, from the ingredient list:</b> ${hit.join(', ')}. Always check product labels and swap to suit your needs.</p>`}
function pageRecipeDetail(slug){const r=DB.recipes.find(x=>x.slug===slug&&x.status==='published');if(!r)return `<section class="page-hero"><div class="wrap"><h1>Recipe not found.</h1></div></section>`;
 const rel=DB.recipes.filter(x=>x.status==='published'&&x.id!==r.id).slice(0,3);
 return `<section style="padding:calc(var(--hdr) + 50px) 0 0"><div class="wrap">
 ${kicker(r.cat)}<h1 style="font-size:clamp(2.2rem,5vw,4rem);margin-top:18px;max-width:22ch">${esc(r.title)}</h1>
 <p class="lead" data-reveal style="margin-top:20px">${esc(r.excerpt)}</p>
 <div class="rd-tools"><a class="tlink" href="#method" data-action="jump" data-to="method">Jump to method ↓</a><button class="tlink" data-action="print">Print recipe ⎙</button><span class="mono" aria-live="polite" id="ing-count">0 / ${r.ingredients.length} ingredients ready</span></div>
 <div class="rd-grid"><div class="rd-left ${r.reel?'is-reel':''}" data-mask>${img(r.seed,r.reel?450:800,r.reel?800:1000,r.title)}
 ${r.reel?(()=>{const rv=reelBy(r.reel);return `<div class="rd-stats"><div><b>${fmtN(rv.v)}</b><span>Plays</span></div><div><b>${fmtN(rv.l)}</b><span>Likes</span></div><div><b>${fmtDur(rv.s)}</b><span>Reel</span></div></div>
 <button class="watch" data-action="reel-open" data-code="${r.reel}"><span class="wp">▶</span><span><b>Watch the reel</b><em>See every step, exactly as Antara cooks it</em></span></button>`})():`<div class="rd-stats"><div><b>${esc(r.prep)}</b><span>Prep</span></div><div><b>${esc(r.cook)}</b><span>Cook</span></div><div><b>${esc(r.serves)}</b><span>Serves</span></div></div>`}
 ${!r.reel&&r.video?`<div style="margin-top:18px;border:1px solid var(--hair);border-radius:var(--rad);padding:18px;display:flex;gap:14px;align-items:center"><span style="width:44px;height:44px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center">▶</span><div><div style="font-weight:600;font-size:.9rem">Watch the process</div><div class="mono" style="margin-top:4px">Reel embed — ${esc(r.video)}</div></div></div>`:''}</div>
 <div class="rd-right"><h2 style="font-size:1.6rem">Ingredients <span class="mono" style="font-size:11px">· tap to tick off</span></h2>
 <ul class="ings" role="group" aria-label="Ingredients checklist">${r.ingredients.map(i=>`<li data-action="tick-ing" role="checkbox" aria-checked="false" tabindex="0"><span class="box"></span>${esc(i)}</li>`).join('')}</ul>
 ${allergenNote(r)}<h2 style="font-size:1.6rem" id="method" tabindex="-1">Method</h2><ol class="steps">${r.steps.map(s=>`<li><p>${esc(s)}</p></li>`).join('')}</ol>
 <p class="mono" style="margin-top:34px">Published ${fmtD(r.date)} · Antara’s kitchen notes</p></div></div>
 <div style="margin:70px 0 0">${kicker('Keep cooking')}<div class="rec-grid">${rel.map(rcard).join('')}</div></div>
 <div style="padding:60px 0 90px"><a class="btn" href="#/recipes">← All Recipes</a></div></div></section>`}
function pageCollab(query){const sv=DB.services||SERVICES_DEFAULT,mk=query&&query.get('type')==='media-kit';
 const types=[...sv.map(x=>x.n),'Media kit request','Something else'];
 return pageHero('Collaborate','Your brand. A better story.','For food, kitchen and lifestyle brands that want more than product placement: original recipes, considered storytelling and content people genuinely want to save and cook.')+`
 <section class="sec" style="padding-top:50px"><div class="wrap">${kicker('Services')}
 <p class="lead" data-reveal style="margin-top:14px">From one hero recipe to a season-long content partnership, every project begins with the audience, the cultural moment and the role the product can honestly play. Pricing is quoted per brief.</p>
 <div class="svc-pack">${sv.map((x,i)=>`<article class="pack" data-reveal><span class="n">${String(i+1).padStart(2,'0')}</span><h3>${esc(x.n)}</h3><p>${esc(x.d)}</p>
 <dl><div><dt>Typically includes</dt><dd><ul>${x.inc.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></dd></div><div><dt>Add-ons</dt><dd>${esc(x.add.join(' · '))}</dd></div><div><dt>Lead time</dt><dd>${esc(x.lead)}</dd></div><div><dt>Usage rights</dt><dd>${esc(x.use)}</dd></div><div><dt>Price</dt><dd>Quoted per brief</dd></div></dl></article>`).join('')}</div>
 ${kicker('The process')}<div class="proc">${[['Discover','A proper conversation about the brand, the audience and what success looks like.'],['Conceptualise','Recipes, references and a treatment — approved before a single pan is heated.'],['Create','Production in natural light, with testing done properly and revisions planned in.'],['Deliver','Final assets, usage terms and honest reporting where numbers exist.']].map(s=>`<div data-reveal><span class="n">STEP →</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div>
 <div style="margin-top:clamp(50px,6vw,80px)">${kicker('Selected results')}<h2 class="h2" style="font-size:clamp(1.8rem,3.4vw,2.8rem)" data-reveal>Brand reels that people actually watch.</h2>${whyAntara()}
 <div class="reel-row scroll" style="margin-top:28px">${visReels().filter(r=>r.b).sort((a,b)=>b.v-a.v).map((r,i)=>reelCard(r,i)).join('')}</div></div>
 <p class="fineprint" style="margin-top:16px">Disclosure matters: every brand reel on this site is labelled — “Paid partnership · #ad” where the post carries the tag, “Brand collaboration” otherwise.</p>
 ${mediaKitCTA()}</div></section>
 <section class="sec sec-cream" id="enquiry"><div class="wrap"><div class="collab-grid">
 <div class="collab-side">${kicker(mk?'Media kit':'Enquiry')}<h2 class="h2" style="font-size:clamp(1.8rem,3vw,2.6rem)" data-reveal>${mk?'Request the media kit.':'Tell Antara about the project.'}</h2>
 <p style="color:var(--ink2);margin-top:18px;font-size:.95rem">Share your brief, timeline and intended usage. Antara’s studio replies within two working days once your enquiry has been delivered.</p>
 <p style="color:var(--ink2);margin-top:12px;font-size:.95rem">Prefer Instagram? <a href="${IGURL()}" target="_blank" rel="noopener" style="color:var(--accent);border-bottom:1px solid var(--accent)">Message ${esc(DB.settings.instagram)}</a>${DB.settings.email?` · or email <a href="mailto:${esc(DB.settings.email)}" style="color:var(--accent);border-bottom:1px solid var(--accent)">${esc(DB.settings.email)}</a>`:''}</p>
 <p class="fineprint" style="margin-top:14px">Your details are used only to reply to this enquiry. <a href="#/privacy" style="text-decoration:underline">How your data is handled</a>.</p></div>
 <div class="collab-form"><form class="form" data-form="enquiry" id="enq-form" novalidate style="max-width:none">
 <div class="form-2col"><div class="field"><label for="eq-name">Name *</label><input id="eq-name" name="name" type="text" autocomplete="name" required data-msg="Please add your name."></div>
 <div class="field"><label for="eq-co">Company / Brand *</label><input id="eq-co" name="company" type="text" autocomplete="organization" required data-msg="Please add your company or brand."></div></div>
 <div class="form-2col"><div class="field"><label for="eq-mail">Professional email *</label><input id="eq-mail" name="email" type="email" autocomplete="email" required data-msg="Please add a valid email, like name@brand.com."></div>
 <div class="field"><label for="eq-type">What do you need? *</label><select id="eq-type" name="type" required>${types.map(o=>`<option ${mk&&o==='Media kit request'?'selected':''}>${esc(o)}</option>`).join('')}</select></div></div>
 <div class="form-2col"><div class="field"><label for="eq-use">Intended usage</label><select id="eq-use" name="usage"><option>Not sure yet</option><option>Organic on Antara’s channels</option><option>Brand’s own channels</option><option>Paid ads / whitelisting</option><option>Print or outdoor</option></select></div>
 <div class="field"><label for="eq-tl">Timeline *</label><select id="eq-tl" name="timeline" required><option>Flexible</option><option>2–4 weeks</option><option>4–6 weeks</option><option>2–3 months</option><option>Festival date — see brief</option></select></div></div>
 <div class="form-2col"><div class="field"><label for="eq-bud">Budget range (optional)</label><select id="eq-bud" name="budget"><option>Undisclosed</option><option>Under ₹50k</option><option>₹50k–₹1L</option><option>₹1–3L</option><option>₹3L+</option></select></div>
 <div class="field"><label for="eq-link">Brief or deck link (optional)</label><input id="eq-link" name="link" type="url" placeholder="https://…" data-msg="Please use a full link starting with https://"></div></div>
 <div class="field"><label for="eq-brief">${mk?'Anything we should know? *':'Project brief *'}</label><textarea id="eq-brief" name="brief" required data-msg="Please add a sentence or two about the project." placeholder="${mk?'Your brand, the campaign window, and what you’d like to see in the kit.':'Goals, audience, product, references — as much or as little as you have.'}"></textarea></div>
 <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
 <button class="btn solid" type="submit" style="justify-self:start">${mk?'Request media kit':'Send enquiry'} <span class="ar">→</span></button>
 <div class="form-status" data-status aria-live="polite"></div></form></div></div></div></section>`}
function pagePrivacy(){const key=!!DB.settings.formKey;return pageHero('Privacy','Privacy & cookies.','What this website collects, why, and what you can ask for. Last updated 30 October 2026.')+`
 <section class="sec" style="padding-top:40px"><div class="wrap prose">
 <h2>Who runs this site</h2><p>This is the website of Antara, a food creator based in Bangalore, India. Contact: <a href="${IGURL()}" target="_blank" rel="noopener">${esc(DB.settings.instagram)} on Instagram</a>${DB.settings.email?` or <a href="mailto:${esc(DB.settings.email)}">${esc(DB.settings.email)}</a>`:''}.</p>
 <h2>What we collect</h2><ul><li><b>Collaboration enquiries</b> — your name, company, email and the details you type into the form.</li><li><b>Sign-ups</b> (the Sunday Note, The Pantry waitlist, the Kitchen Academy list) — your email address, the list you joined and, if you choose, your interests.</li><li>Nothing else. This site does not use analytics, advertising trackers or its own cookies.</li></ul>
 <h2>Why, and on what basis</h2><p>Enquiry details are used only to reply to you and, if we work together, to manage the collaboration. Sign-up emails are used only to send the updates you asked for, based on the consent you give when you tick the box. You can withdraw that consent at any time.</p>
 <h2>Who processes it</h2><p>${key?'Form submissions are delivered to Antara by email through Web3Forms, a form-delivery service. They are then kept in Antara’s email inbox.':'Online form delivery is not switched on yet, so this site does not collect any form data. Until it is, the enquiry form helps you contact Antara by Instagram message or email instead.'}</p>
 <h2>How long it is kept</h2><p>Enquiries are kept for as long as needed to reply and, for collaborations, for the period required for contracts and accounts. Sign-up emails are kept until you unsubscribe or ask for deletion.</p>
 <h2>Instagram videos</h2><p>Reels on this site are shown with Instagram’s own player, which loads only when you tap a reel. At that point Instagram (Meta) may set cookies and collect data under <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener">Instagram’s privacy policy</a>. Cover images are stored on this site, so browsing does not contact Instagram.</p>
 <h2>Your choices</h2><p>You can ask to see, correct or delete what you have shared, or unsubscribe, by messaging ${esc(DB.settings.instagram)} on Instagram${DB.settings.email?' or emailing '+esc(DB.settings.email):''}. Requests are handled promptly, and in any case within 30 days.</p>
 </div></section>`}
function pagePantry(){return pageHero('The Pantry','Something delicious is taking shape.',"The future home of Antara's own products — a working title for a chapter still being written. Nothing is for sale yet, and that honesty is the whole point.")+`
 <section class="sec" style="padding-top:50px"><div class="wrap"><div class="pantry-grid">
 <div class="pantry-txt">${kicker('What might come')}<p data-reveal style="color:var(--ink2);margin-top:22px;max-width:52ch">When The Pantry opens, it will open slowly — small batches first, ingredients with provenance, and packaging that does not pretend to be something it is not. Until then, these are the only promises:</p>
 <div class="hints" data-reveal><div class="hint"><span class="n">01</span><p>Small-batch, first.</p></div><div class="hint"><span class="n">02</span><p>Rooted in Bengal, packed for anywhere.</p></div><div class="hint"><span class="n">03</span><p>Every label will have a story worth reading.</p></div></div>
 ${waitForm('pantry',true)}</div>
 <div class="pantry-fig" data-mask>${img('sugar-linen-flatlay-pantry',760,950,'Abstract pantry composition with linen and sugar')}<div class="mono" style="margin-top:12px">Mood study — not final packaging</div></div></div>
 <div style="margin-top:clamp(50px,6vw,80px)">${kicker('How it will launch')}
 <div class="timeline" data-reveal><div><span class="ph-n">PHASE 01</span><h3>Coming Soon</h3><p>Teaser, waitlist and early taste-tests with subscribers.</p><span class="live">● We are here</span></div><div><span class="ph-n">PHASE 02</span><h3>Discovery</h3><p>Collections, ingredient stories, allergen information, pricing.</p></div><div><span class="ph-n">PHASE 03</span><h3>Full Commerce</h3><p>Cart, secure checkout, shipping and honest support — when fulfilment is genuinely ready.</p></div></div></div>
 <div style="margin-top:clamp(50px,6vw,80px)" data-reveal>${[['When does The Pantry launch?','There is no fixed date yet — it launches when the first product is genuinely right. Waitlist members hear first, always.'],
 ['What will the first product be?','Deliberately undecided. Desserts, preserves and baking preparations are all on the table; the ingredient will choose.'],
 ['Will you ship widely?','Shipping scope depends on the product. Fulfilment will never be faked or rushed.']].map(([q,a])=>`<div class="acc-item"><button class="acc-h" data-action="acc" aria-expanded="false">${q}<span class="pm">+</span></button><div class="acc-b"><div>${a}</div></div></div>`).join('')}</div></div></section>`}
function pageAcademy(){return pageHero('The Kitchen Academy','Learn. Create. Make it yours.','Future cooking courses, baking masterclasses and workshops — currently in development as concepts, clearly labelled as such.')+`
 <section class="sec" style="padding-top:50px"><div class="wrap">${kicker('Planned curriculum')}
 <div data-reveal>${DB.courses.map((c,i)=>`<div class="acc-item"><button class="acc-h" data-action="acc" aria-expanded="false"><span><span class="mono" style="margin-right:16px;color:var(--terra-t)">${String(i+1).padStart(2,'0')}</span>${esc(c.title)}</span><span class="pm">+</span></button>
 <div class="acc-b"><div><p>${esc(c.blurb)}</p><p class="mono" style="margin-top:10px">${esc(c.level)} · ${esc(c.dur)} · Concept — not yet open for enrolment</p></div></div></div>`).join('')}</div>
 <div class="collab-grid" style="margin-top:clamp(50px,6vw,80px)"><div class="collab-side">${kicker('How it will work')}
 ${[['Waitlist first','Join the learning list; cohort sizes will stay small on purpose.'],['Taught, not templated','Video lessons with downloadable recipes, built around real practice.'],['Priced honestly','Clear pricing and free preview lessons once courses launch.']].map((s,i)=>`<div class="hint"><span class="n">${String(i+1).padStart(2,'0')}</span><p style="font-family:var(--ff-b);font-style:normal;font-size:.95rem;color:var(--ink2)">${s[1]}</p></div>`).join('')}
 <div style="margin-top:26px">${waitForm('academy',false)}</div></div>
 <div class="collab-form" data-mask>${img('academy-bench-flour-lesson',900,700,'A flour-dusted workbench prepared for a lesson')}<div class="mono" style="margin-top:12px">The bench where lessons will be filmed</div></div></div></div></section>`}
function injectRecipeLD_unused(r){const s=document.createElement('script');s.type='application/ld+json';s.id='recipe-ld';
 s.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Recipe',name:r.title,description:r.excerpt,image:photoURL(r.seed,900,1125),...(r.prep&&r.prep!=='—'?{prepTime:r.prep,cookTime:r.cook,recipeYield:r.serves}:{}),...(r.reel?{video:{'@type':'VideoObject',name:r.title,description:r.excerpt,thumbnailUrl:IGURL(),embedUrl:`https://www.instagram.com/reel/${r.reel}/embed/`,uploadDate:new Date(r.date).toISOString()}}:{}),recipeCategory:r.cat,recipeIngredient:r.ingredients,recipeInstructions:r.steps.map(x=>({'@type':'HowToStep',text:x})),author:{'@type':'Person',name:'Antara'}});
 document.head.appendChild(s)}

/* ================= ACTIONS ================= */
function findSec(id){return DB.pages.home.draft.find(s=>s.id===id)}
function refreshPages(){const seg=$('#sec-list');if(seg){seg.innerHTML=DB.pages.home.draft.map((s,i)=>secRow(s,i)).join('');bindDrag()}}
function bindDrag(){const list=$('#sec-list');if(!list)return;
 list.querySelectorAll('.builder-row').forEach(row=>{
  row.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',row.dataset.sec);row.style.opacity='.4'});
  row.addEventListener('dragend',()=>{row.style.opacity=''});
  row.addEventListener('dragover',e=>{e.preventDefault();row.classList.add('dragover')});
  row.addEventListener('dragleave',()=>row.classList.remove('dragover'));
  row.addEventListener('drop',e=>{e.preventDefault();row.classList.remove('dragover');
   const fromId=e.dataTransfer.getData('text/plain'),toId=row.dataset.sec;if(fromId===toId)return;
   const d=DB.pages.home.draft,fi=d.findIndex(s=>s.id===fromId),ti=d.findIndex(s=>s.id===toId);
   const[m]=d.splice(fi,1);d.splice(ti,0,m);DB.pages.home.dirty=true;save();refreshPages();toast('Section reordered — saved to draft')})})}
function exportCSV(name,rows){const c=rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:'text/csv'}));a.download=name;a.click()}

document.addEventListener('click',e=>{
 if(e.target.id==='modal'&&$('#modal .reel-lb')){closeModal();return}
 const t=e.target.closest('[data-action]');if(!t)return;const a=t.dataset.action,id=t.dataset.id;
 if(t.hasAttribute('data-close')){closeModal();return}
 switch(a){
  case 'reel-open':{e.preventDefault();const scope=t.closest('#reel-grid,.reel-row');const seq=scope?[...scope.querySelectorAll('[data-action=reel-open]')].map(b=>b.dataset.code):[];openReel(t.dataset.code,seq);break}
  case 'reel-step':{const n=reelIdx+(+t.dataset.d);if(n>=0&&n<reelSeq.length)openReel(reelSeq[n],reelSeq);break}
  case 'reel-cat':{RF.cat=t.dataset.k;RF.n=24;$$('[data-action=reel-cat]').forEach(c=>{c.classList.toggle('on',c===t);c.setAttribute('aria-pressed',c===t)});refreshReels();break}
  case 'reel-more':{RF.n+=24;refreshReels();break}
  case 'reel-vis':{const c=t.dataset.code,h=DB.reelHidden;const i=h.indexOf(c);if(i>-1)h.splice(i,1);else h.push(c);save();t.textContent=i>-1?'👁 Shown':'🚫 Hidden';t.closest('tr').classList.toggle('row-off',i<0);toast(i>-1?'Reel shown on the site':'Reel hidden from the site');break}
  case 'copy-brief':{const f=t.closest('form');const txt=f&&f.__brief||'';(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Brief copied — paste it into your message ✓')).catch(()=>toast('Couldn’t copy automatically — select the brief text and copy it','err'));break}
  case 'menu-open':menuSet(true);break; case 'menu-close':menuSet(false);break;
  case 'logout':localStorage.removeItem(SKEY);toast('Signed out.');location.hash='#/admin/login';break;
  case 'filter-work':{$$('[data-action=filter-work]').forEach(c=>c.classList.toggle('on',c===t));$('#work-grid').innerHTML=workGridHTML(t.dataset.f);initReveals();break}
  case 'filter-rec':{$$('[data-action=filter-rec]').forEach(c=>c.classList.toggle('on',c===t));$('#rec-grid').innerHTML=recGridHTML(t.dataset.f);initReveals();break}
  case 'acc':{const it=t.closest('.acc-item'),b=it.querySelector('.acc-b'),open=it.classList.toggle('open');b.style.maxHeight=open?b.scrollHeight+'px':'0';t.setAttribute('aria-expanded',open);break}
  case 'tick-ing':{t.classList.toggle('done');t.setAttribute('aria-checked',t.classList.contains('done'));const all=$$('.ings li'),d=$$('.ings li.done');const c=$('#ing-count');if(c)c.textContent=`${d.length} / ${all.length} ingredients ready`;if(d.length===all.length&&all.length)toast('Mise en place done — time to cook ✓');break}
  case 'jump':{e.preventDefault();const el=document.getElementById(t.dataset.to);if(el){el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});el.focus({preventScroll:true})}break}
  case 'scroll-next':{e.preventDefault();const el=$('.ticker');if(el)window.scrollTo({top:el.getBoundingClientRect().top+scrollY-60,behavior:reduced?'auto':'smooth'});break}
  case 'print':window.print();break;
  case 'to-top':window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});break;
  case 'rec-feat':{const r=DB.recipes.find(x=>x.id===id);r.featured=!r.featured;audit(`${r.featured?'Featured':'Unfeatured'} recipe — ${r.title}`);save();admRerender('recipes');toast(r.featured?'Marked as featured ★':'Removed from featured');break}
  case 'rec-pub':{const r=DB.recipes.find(x=>x.id===id);r.status=r.status==='published'?'draft':'published';r.date=Date.now();audit(`${r.status==='published'?'Published':'Unpublished'} recipe — ${r.title}`);save();admRerender('recipes');toast(r.status==='published'?'Published — live on the site ✓':'Moved to draft');break}
  case 'rec-dup':{const r=DB.recipes.find(x=>x.id===id);const c=clone(r);c.id=uid();c.title+=' (copy)';c.slug=slugify(c.title)+'-'+c.id.slice(2,5);c.status='draft';c.featured=false;c.date=Date.now();DB.recipes.unshift(c);audit('Duplicated recipe — '+r.title);save();admRerender('recipes');toast('Duplicated as draft');break}
  case 'rec-arch':{const r=DB.recipes.find(x=>x.id===id);r.status='archived';audit('Archived recipe — '+r.title);save();admRerender('recipes');toast('Archived — hidden from public site');break}
  case 'rec-del':{const r=DB.recipes.find(x=>x.id===id);confirmBox('Delete recipe permanently?','Archiving is usually kinder — but this deletes “'+r.title+'” forever.','Delete',true).then(ok=>{if(!ok)return;DB.recipes=DB.recipes.filter(x=>x.id!==id);audit('Deleted recipe — '+r.title);save();admRerender('recipes');toast('Recipe deleted','err')});break}
  case 'rec-fs':{const f=t.dataset.f;$$('[data-action=rec-fs]').forEach(c=>c.classList.toggle('on',c===t));
   const q=($('[data-action=rec-search]')?.value||'').toLowerCase();
   let rs=DB.recipes.filter(r=>f==='All'||r.status===f);if(q)rs=rs.filter(r=>r.title.toLowerCase().includes(q));
   $('#rec-table tbody').innerHTML=recRows(rs);break}
  case 'proj-new':openModal(`<h3>New project</h3>`+projFormHTML(null));break;
  case 'proj-edit':openModal(`<h3>Edit project</h3>`+projFormHTML(DB.projects.find(p=>p.id===id)));break;
  case 'proj-pub':{const p=DB.projects.find(x=>x.id===id);p.status=p.status==='published'?'draft':'published';audit(`${p.status==='published'?'Published':'Unpublished'} project — ${p.title}`);save();admRerender('projects');toast('Updated');break}
  case 'proj-del':{const p=DB.projects.find(x=>x.id===id);confirmBox('Delete project?','This permanently removes “'+p.title+'” from the portfolio.','Delete',true).then(ok=>{if(!ok)return;DB.projects=DB.projects.filter(x=>x.id!==id);audit('Deleted project — '+p.title);save();admRerender('projects');toast('Project deleted','err')});break}
  case 'sec-edit':secDrawer(id);break;
  case 'drawer-close':closeDrawer();break;
  case 'sec-vis':{const s=findSec(id);s.visible=!s.visible;DB.pages.home.dirty=true;save();refreshPages();toast(s.visible?'Section shown':'Section hidden — draft only');break}
  case 'sec-dup':{const d=DB.pages.home.draft,i=d.findIndex(s=>s.id===id);const c=clone(d[i]);c.id=uid();c.label+=' (copy)';d.splice(i+1,0,c);DB.pages.home.dirty=true;save();refreshPages();toast('Section duplicated — draft');break}
  case 'sec-up':case 'sec-down':{const d=DB.pages.home.draft,i=d.findIndex(s=>s.id===id),j=a==='sec-up'?i-1:i+1;if(j<0||j>=d.length)break;[d[i],d[j]]=[d[j],d[i]];DB.pages.home.dirty=true;save();refreshPages();toast('Reordered — draft');break}
  case 'sec-del':{const d=DB.pages.home.draft,i=d.findIndex(s=>s.id===id);DB.pages.home.trash.push(d[i]);d.splice(i,1);DB.pages.home.dirty=true;save();admRerender('pages');toast('Moved to bin — restore it any time');break}
  case 'sec-restore':{const tr=DB.pages.home.trash,i=tr.findIndex(s=>s.id===id);DB.pages.home.draft.push(tr[i]);tr.splice(i,1);DB.pages.home.dirty=true;save();admRerender('pages');toast('Restored from bin ✓');break}
  case 'sec-purge':{const tr=DB.pages.home.trash,s=tr.find(x=>x.id===id);confirmBox('Delete forever?','“'+s.label+'” will be unrecoverable.','Delete forever',true).then(ok=>{if(!ok)return;DB.pages.home.trash=tr.filter(x=>x.id!==id);save();admRerender('pages');toast('Deleted permanently','err')});break}
  case 'pages-save':save();admRerender('pages');toast('Draft saved — nothing is live yet');break;
  case 'pages-publish':DB.pages.home.live=clone(DB.pages.home.draft);DB.pages.home.dirty=false;audit('Published homepage layout ('+DB.pages.home.live.length+' sections)');save();admRerender('pages');toast('Published — the public homepage is updated ✓');break;
  case 'pages-discard':confirmBox('Discard draft changes?','The draft will revert to the currently published layout.','Discard',true).then(ok=>{if(!ok)return;DB.pages.home.draft=clone(DB.pages.home.live);DB.pages.home.dirty=false;save();admRerender('pages');toast('Draft discarded')});break;
  case 'pages-preview':{openModal(`<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap"><h3 style="margin:0;font-size:1.2rem">Draft preview</h3><div class="dev-bar">
   ${[['Desktop','100%'],['Tablet · 768','768px'],['Mobile · 390','390px']].map(([l,v],i)=>`<button class="abtn ${i===0?'pri':''}" data-dev="${v}">${l}</button>`).join('')}</div></div>
   <div class="frame-wrap" id="fw" style="width:100%"><iframe src="${location.pathname}#/?draft=1" title="Homepage draft preview"></iframe></div>`,true);
   $$('#modal [data-dev]').forEach(b=>b.onclick=()=>{$$('#modal [data-dev]').forEach(x=>x.classList.remove('pri'));b.classList.add('pri');$('#fw').style.width=b.dataset.dev});break}
  case 'media-upload':openModal(`<h3>Add asset</h3><form class="form" data-form="media" style="max-width:none">
   <div class="field"><label>Image link or seed</label><input name="seed" placeholder="Paste an image URL (https://…) or a seed name"></div>
   <div class="field"><label>Alt text *</label><input name="alt" required placeholder="Describe the image for screen readers & SEO"></div>
   <div class="field"><label>…or upload a file (demo stores small files inline)</label><input type="file" name="file" accept="image/*"></div>
   <div class="m-actions"><button class="abtn" type="button" data-close>Cancel</button><button class="abtn pri" type="submit">Add to library</button></div></form>`);break;
  case 'media-alt':{const m=DB.media.find(x=>x.id===id);openModal(`<h3>Edit alt text</h3><form class="form" data-form="media-alt" data-id="${id}"><div class="field"><label>Alt text</label><input name="alt" value="${esc(m.alt)}" required></div><div class="m-actions"><button class="abtn" type="button" data-close>Cancel</button><button class="abtn pri" type="submit">Save</button></div></form>`);break}
  case 'media-del':{const m=DB.media.find(x=>x.id===id);const used=JSON.stringify(DB).includes(m.seed);
   confirmBox('Delete asset?',used?'This asset appears to be referenced by live content. Deleting may break layouts.':'This asset will be removed from the library.','Delete',true).then(ok=>{if(!ok)return;DB.media=DB.media.filter(x=>x.id!==id);audit('Deleted media — '+m.seed);save();admRerender('media');toast('Asset deleted','err')});break}
  case 'enq-view':{const en=DB.enquiries.find(x=>x.id===id);openModal(`<div class="mono">${fmtD(en.date)} · ${esc(en.type)}</div><h3>${esc(en.name)} — ${esc(en.company)}</h3>
   <dl style="display:grid;grid-template-columns:110px 1fr;gap:10px 16px;margin:18px 0;font-size:.92rem">${[['Email',en.email],['Budget',en.budget],['Timeline',en.timeline],['Brief',en.brief]].map(([k,v])=>`<dt class="mono" style="padding-top:3px">${k}</dt><dd style="color:var(--ink2)">${esc(v)}</dd>`).join('')}</dl>
   <div class="field"><label>Internal notes</label><textarea data-enq-note="${en.id}" style="min-height:80px">${esc(en.notes)}</textarea></div>
   <div class="m-actions"><button class="abtn pri" data-action="enq-note-save" data-id="${en.id}">Save notes</button></div>`);break}
  case 'enq-note-save':{const en=DB.enquiries.find(x=>x.id===id);en.notes=$(`[data-enq-note="${id}"]`).value;save();toast('Notes saved');closeModal();break}
  case 'enq-del':{const en=DB.enquiries.find(x=>x.id===id);confirmBox('Delete enquiry?','Enquiry from '+en.name+' will be removed.','Delete',true).then(ok=>{if(!ok)return;DB.enquiries=DB.enquiries.filter(x=>x.id!==id);save();admRerender('enquiries');toast('Deleted','err')});break}
  case 'enq-export':exportCSV('enquiries.csv',[['Name','Company','Email','Type','Budget','Timeline','Status','Date'],...DB.enquiries.map(e=>[e.name,e.company,e.email,e.type,e.budget,e.timeline,e.status,fmtD(e.date)])]);toast('CSV exported ↓');break;
  case 'sub-export':exportCSV('subscribers.csv',[['Email','Source','Interests','Date'],...DB.subscribers.map(s=>[s.email,s.source,s.interests.join('; '),fmtD(s.date)])]);toast('CSV exported ↓');break;
  case 'sub-del':{DB.subscribers=DB.subscribers.filter(x=>x.id!==id);save();admRerender('subscribers');toast('Subscriber removed','err');break}
  case 'sub-f':{$$('[data-action=sub-f]').forEach(c=>c.classList.toggle('on',c===t));const f=t.dataset.f;
   $('#sub-table tbody').innerHTML=subRows(DB.subscribers.filter(s=>f==='All'||s.source===f));break}
  case 'logo-del':{const b=t.dataset.b;confirmBox('Remove logo?','The '+b+' logo will be replaced by its wordmark.','Remove',true).then(ok=>{if(!ok)return;delete DB.brandLogos[b];audit('Removed logo — '+b);save();admRerender('settings');toast(b+' logo removed')});break}
  case 'preset':DB.tokens.theme=t.dataset.p;applyTokens();save();audit('Applied theme preset — '+t.dataset.p);admRerender('design');toast('Theme applied site-wide ✓');break;
  case 'accent':DB.tokens.accent=t.dataset.a;applyTokens();save();audit('Changed accent colour — '+t.dataset.a);admRerender('design');toast('Accent updated ✓');break;
  case 'design-reset':DB.tokens={theme:'ivory',display:'Fraunces',body:'Manrope',accent:'burg',radius:3};applyTokens();save();audit('Reset design tokens to brand defaults');admRerender('design');toast('Reset to brand defaults');break;
 }
});
function admRerender(mod){const path=currentRoute().path;renderAdmin(path.startsWith('/admin')?path:'#/admin/'+mod);
 if(mod==='pages')setTimeout(bindDrag,0)}
document.addEventListener('input',e=>{
 if(e.target.matches('[data-reel-q]')){RF.q=e.target.value.trim();RF.n=24;clearTimeout(window.__rq);window.__rq=setTimeout(refreshReels,160)}
 if(e.target.dataset.tok){DB.tokens[e.target.dataset.tok]=e.target.value;applyTokens();save()}
 if(e.target.dataset.tokRange){DB.tokens[e.target.dataset.tokRange]=+e.target.value;applyTokens();save();
  const lb=e.target.closest('.field')?.querySelector('label');if(lb)lb.textContent=`Corner radius — ${e.target.value}px`}
 if(e.target.matches('[data-action=rec-search]')){const q=e.target.value.toLowerCase();const f=$('[data-action=rec-fs].on')?.dataset.f||'All';
  let rs=DB.recipes.filter(r=>f==='All'||r.status===f);if(q)rs=rs.filter(r=>r.title.toLowerCase().includes(q));$('#rec-table tbody').innerHTML=recRows(rs)}
});
document.addEventListener('change',e=>{
 if(e.target.matches('[data-reel-sort]')){RF.sort=e.target.value;refreshReels();return}
 const lb=e.target.dataset.logoFile||e.target.dataset.logoUrl;
 if(lb){const setLogo=v=>{DB.brandLogos=DB.brandLogos||{};if(v)DB.brandLogos[lb]=v;else delete DB.brandLogos[lb];audit((v?'Added logo — ':'Removed logo — ')+lb);save();admRerender('settings');toast(v?lb+' logo added ✓':lb+' logo removed')};
  if(e.target.dataset.logoFile){const file=e.target.files[0];if(!file)return;
   if(!/^image\//.test(file.type)){toast('Please choose an image file','err');return}
   if(file.size>300*1024){toast('Logo is over 300 KB — export a smaller SVG/PNG','err');return}
   const rd=new FileReader();rd.onload=()=>setLogo(rd.result);rd.readAsDataURL(file)}
  else{const v=e.target.value.trim();if(v&&!/^https:\/\//.test(v)){toast('Use a secure https:// link to the logo file','err');return}setLogo(v)}
  return}
 if(e.target.dataset.enqSt){const en=DB.enquiries.find(x=>x.id===e.target.dataset.enqSt);en.status=e.target.value;audit(`Enquiry ${en.name} → ${en.status}`);save();toast('Status updated → '+en.status)}
});
/* ================= FORMS ================= */
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function fieldValid(i){if(i.type==='checkbox')return !i.required||i.checked;const v=String(i.value||'').trim();if(i.required&&!v)return false;if(i.type==='email'&&v)return emailOk(v);if(i.type==='url'&&v)return /^https?:\/\/\S+\.\S+/.test(v);return true}
function showFieldError(i,bad){const id=(i.id||i.name)+'-err';let m=document.getElementById(id);
 if(bad){if(!m){m=document.createElement('span');m.className='f-err';m.id=id;(i.closest('.consent')||i).insertAdjacentElement('afterend',m)}m.textContent=i.dataset.msg||'Please check this field.';i.setAttribute('aria-invalid','true');const d=(i.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==id);d.push(id);i.setAttribute('aria-describedby',d.join(' '))}
 else{i.removeAttribute('aria-invalid');if(m)m.remove();const d=(i.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==id);d.length?i.setAttribute('aria-describedby',d.join(' ')):i.removeAttribute('aria-describedby')}}
function validateForm(f){let first=null;f.querySelectorAll('input:not(.hp):not([type=hidden]),select,textarea').forEach(i=>{const bad=!fieldValid(i);showFieldError(i,bad);if(bad&&!first)first=i});return first}
document.addEventListener('input',e=>{const i=e.target;if(i.getAttribute&&i.getAttribute('aria-invalid')==='true'&&fieldValid(i))showFieldError(i,false)});
document.addEventListener('change',e=>{const i=e.target;if(i.getAttribute&&i.getAttribute('aria-invalid')==='true'&&fieldValid(i))showFieldError(i,false)});
const FORM_LABEL={home:'Sunday Note (homepage)',pantry:'The Pantry waitlist',academy:'Kitchen Academy learning list'};
async function deliverForm(subject,fields){const key=(DB.settings.formKey||'').trim();if(!key)return{ok:false,reason:'off'};
 try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:key,subject,from_name:'antara website',botcheck:false,...fields})});
  const j=await r.json().catch(()=>({}));return r.ok&&j.success?{ok:true}:{ok:false,reason:'error',msg:j.message||('Error '+r.status)}}catch(e){return{ok:false,reason:'network'}}}
function briefText(fd){return ['Name: '+fd.get('name'),'Company: '+fd.get('company'),'Email: '+fd.get('email'),'Need: '+fd.get('type'),'Usage: '+fd.get('usage'),'Timeline: '+fd.get('timeline'),'Budget: '+fd.get('budget'),fd.get('link')?'Link: '+fd.get('link'):'','','Brief:',fd.get('brief')].filter(x=>x!==null).join('\n')}
async function submitPublicForm(f,kind){const status=f.querySelector('[data-status]')||(()=>{const d=document.createElement('div');d.className='form-status';d.dataset.status='';f.appendChild(d);return d})();
 const bad=validateForm(f);if(bad){toast(kind==='enquiry'?'Please check the highlighted fields':'Please check the highlighted field','err');bad.focus();return}
 const fd=new FormData(f),btn=f.querySelector('button[type=submit]'),label=btn.innerHTML;
 const list=kind==='enquiry'?'':kind==='newsletter'?(f.dataset.src?FORM_LABEL[f.dataset.src]:'Sunday Note (footer)'):FORM_LABEL[f.dataset.src]||'Waitlist';
 const subject=kind==='enquiry'?`${fd.get('type')==='Media kit request'?'Media kit request':'New collaboration enquiry'} — ${fd.get('company')}`:`New sign-up — ${list}`;
 const fields=kind==='enquiry'?{name:fd.get('name'),email:fd.get('email'),company:fd.get('company'),need:fd.get('type'),usage:fd.get('usage'),timeline:fd.get('timeline'),budget:fd.get('budget'),link:fd.get('link')||'',message:fd.get('brief')}:{email:fd.get('email'),list,interests:fd.getAll('int').join(', ')||'—',consent:'Yes — ticked on the form'};
 btn.disabled=true;btn.setAttribute('aria-busy','true');btn.innerHTML='Sending…';status.className='form-status';status.textContent='';
 const res=await deliverForm(subject,fields);
 btn.disabled=false;btn.removeAttribute('aria-busy');btn.innerHTML=label;
 if(res.ok){f.innerHTML=kind==='enquiry'?`<div class="success" tabindex="-1"><h3>Thank you — your ${fd.get('type')==='Media kit request'?'request':'enquiry'} has been delivered. ✓</h3><p>Antara’s studio replies within two working days. A copy of what you sent is below.</p><pre class="brief-copy">${esc(briefText(fd))}</pre></div>`
   :`<div class="success" tabindex="-1"><h3>You’re on the list. ✓</h3><p>${f.dataset.src==='pantry'?'The moment The Pantry has something real to share, you’ll hear it first.':f.dataset.src==='academy'?'Course announcements and early invites will come your way first.':'One note, occasionally. Unsubscribe anytime.'}</p></div>`;
  f.querySelector('.success')?.focus();return}
 if(res.reason==='off'){
  if(kind==='enquiry'){const body=encodeURIComponent(briefText(fd));const mail=DB.settings.email?`mailto:${DB.settings.email}?subject=${encodeURIComponent(subject)}&body=${body}`:'';
   status.className='form-status warn';status.innerHTML=`<p><b>Online sending isn’t switched on yet — nothing has been sent.</b> Your details are still in the form. To reach Antara now:</p><div class="fs-acts">${mail?`<a class="btn sm solid" href="${mail}">Email this brief</a>`:''}<a class="btn sm ${mail?'':'solid'}" href="${IGURL()}" target="_blank" rel="noopener">Message on Instagram ↗</a><button class="btn sm" type="button" data-action="copy-brief">Copy my brief</button></div>`;
   f.__brief=briefText(fd)}
  else{status.className='form-status warn';status.innerHTML=`<p><b>Sign-ups open soon — nothing has been saved.</b> For now, follow <a href="${IGURL()}" target="_blank" rel="noopener">${esc(DB.settings.instagram)}</a> for updates.</p>`}
  const a=$('#alerts');if(a){a.textContent='';setTimeout(()=>a.textContent=status.textContent,30)}return}
 status.className='form-status err';status.innerHTML=`<p><b>${res.reason==='network'?'We couldn’t reach the form service — check your connection.':'The form service didn’t accept the message.'}</b> Nothing was lost; your details are still in the form. Try again, or message <a href="${IGURL()}" target="_blank" rel="noopener">${esc(DB.settings.instagram)}</a>.</p>`;
 const a=$('#alerts');if(a){a.textContent='';setTimeout(()=>a.textContent=status.textContent,30)}}
document.addEventListener('submit',e=>{
 const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
 const kind=f.dataset.form,fd=new FormData(f),err=f.querySelector('[data-err]');
 const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 const fail=()=>{f.querySelectorAll('[required]').forEach(i=>{const bad=i.type==='email'?!emailOk(i.value.trim()):!String(i.value).trim();i.setAttribute('aria-invalid',bad)});if(err){err.hidden=false;toast('Please check the highlighted fields','err')}f.querySelector('[aria-invalid=true]')?.focus()};
 if(fd.get('hp')||fd.get('botcheck'))return;
 switch(kind){
  case 'newsletter':case 'waitlist':case 'enquiry':{submitPublicForm(f,kind);break}
  case 'recipe':{const title=(fd.get('title')||'').trim();if(!title){toast('A recipe needs a title','err');return}
   const ings=(fd.get('ingredients')||'').split('\n').map(x=>x.trim()).filter(Boolean);
   const steps=(fd.get('steps')||'').split('\n').map(x=>x.trim()).filter(Boolean);
   if(!ings.length||!steps.length){toast('Add at least one ingredient and one step','err');return}
   const data={title,cat:fd.get('cat'),status:fd.get('status'),excerpt:fd.get('excerpt')||'',seed:fd.get('seed')||slugify(title),prep:fd.get('prep')||'—',cook:fd.get('cook')||'—',serves:fd.get('serves')||'—',video:fd.get('video')||'',featured:!!fd.get('featured'),ingredients:ings,steps:steps,date:Date.now()};
   const id=f.dataset.id;
   if(id==='new'){let slug=slugify(title);while(DB.recipes.some(r=>r.slug===slug))slug+='-'+uid().slice(2,4);DB.recipes.unshift({id:uid(),slug,...data});audit('Created recipe — '+title)}
   else{const r=DB.recipes.find(x=>x.id===id);let slug=slugify(title);while(DB.recipes.some(x=>x.slug===slug&&x.id!==id))slug+='-'+uid().slice(2,4);Object.assign(r,data,{slug});audit('Updated recipe — '+title)}
   save();location.hash='#/admin/recipes';toast('Recipe saved ✓');break}
  case 'project':{const title=(fd.get('title')||'').trim();if(!title){toast('Title required','err');return}
   const data={title,brand:fd.get('brand')||'Independent',cat:fd.get('cat'),type:fd.get('type'),format:fd.get('format')||'',year:+fd.get('year')||2026,brief:fd.get('brief')||'',role:fd.get('role')||'',seed:fd.get('seed')||slugify(title),deliverables:(fd.get('deliverables')||'').split('\n').filter(Boolean),featured:!!fd.get('featured')};
   if(f.dataset.id==='new'){DB.projects.unshift({id:uid(),slug:slugify(title)+'-'+uid().slice(2,5),status:'draft',results:'',concept:'',...data});audit('Added project — '+title)}
   else{const p=DB.projects.find(x=>x.id===f.dataset.id);Object.assign(p,data);audit('Updated project — '+title)}
   save();closeModal();admRerender('projects');toast('Project saved ✓');break}
  case 'section':{const s=findSec(f.dataset.id);Object.keys(s.f).forEach(k=>{if(fd.get(k)!==null)s.f[k]=fd.get(k)});s.visible=!!fd.get('visible');DB.pages.home.dirty=true;save();closeDrawer();refreshPages();toast('Saved to draft — publish to go live');break}
  case 'media':{const seed=(fd.get('seed')||'').trim(),alt=(fd.get('alt')||'').trim(),file=fd.get('file');
   if(!alt){toast('Alt text is required for accessibility','err');return}
   if(file&&file.size){if(file.size>600*1024){toast('Demo cap: files under 600KB. Production uses cloud storage.','err');return}
    const rd=new FileReader();rd.onload=()=>{DB.media.unshift({id:uid(),seed:rd.result,alt});save();closeModal();admRerender('media');toast('Asset added ✓')};rd.readAsDataURL(file);return}
   if(!seed){toast('Add a seed or upload a file','err');return}
   DB.media.unshift({id:uid(),seed,alt});audit('Added media — '+seed);save();closeModal();admRerender('media');toast('Asset added ✓');break}
  case 'media-alt':{const m=DB.media.find(x=>x.id===f.dataset.id);m.alt=fd.get('alt');save();closeModal();admRerender('media');toast('Alt text updated ✓');break}
  case 'settings':{Object.assign(DB.settings,{email:fd.get('email'),instagram:fd.get('instagram'),signature:fd.get('signature'),location:fd.get('location')});audit('Updated site settings');save();toast('Settings saved — footer & contact updated ✓');break}
 }
});
document.addEventListener('load',e=>{const t=e.target;if(t.tagName==='IMG')t.classList.add('ld');else if(t.classList&&t.classList.contains('lb-frame'))t.classList.add('ready')},true);
document.addEventListener('error',e=>{const t=e.target;if(t.tagName!=='IMG'||t.dataset.failed)return;t.dataset.failed='1';
 const bm=t.closest('.bmark.has-logo,.logomark.has-logo');if(bm){bm.classList.remove('has-logo');bm.innerHTML=`<span class="wm">${esc(t.alt)}</span>`;return}
 t.classList.add('ld','broken');const p=t.parentElement;if(p&&t.alt){p.classList.add('img-fail');p.setAttribute('data-fail',t.alt)}},true);
document.addEventListener('click',e=>{if(ROUTING!=='path'||e.defaultPrevented)return;const a=e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download')||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
 const u=new URL(a.href,location.href);if(u.origin!==location.origin||(BASE&&!u.pathname.startsWith(BASE))||/\.[a-z0-9]{2,5}$/i.test(u.pathname))return;if(u.pathname===location.pathname&&u.hash)return;
 e.preventDefault();if(u.pathname+u.search!==location.pathname+location.search)history.pushState(null,'',u.pathname+u.search);route()});
/* ---------- PUBLISHED CONTENT (from the private Studio) ---------- */
function applyContent(c){if(!c||c.v!==4)return false;['settings','tokens','services','brands','brandLogos','courses','reelHidden'].forEach(k=>{if(c[k]!=null)DB[k]=c[k]});
 if(Array.isArray(c.recipes))DB.recipes=c.recipes;if(Array.isArray(c.projects))DB.projects=c.projects;if(c.pages&&c.pages.home&&c.pages.home.live)DB.pages.home.live=c.pages.home.live;DB.publishedAt=c.published;applyTokens();return true}
if(location.protocol==='file:'){try{applyContent(JSON.parse(localStorage.getItem('antara_published')))}catch(e){}}
/* boot */
route();
if(/^https?:$/.test(location.protocol)&&ROUTING==='path'){fetch((BASE||'')+'/content.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(c=>{if(c&&c.published!==DB.publishedAt&&applyContent(c)){const {path,query}=currentRoute();renderSite(path,query);initReveals()}}).catch(()=>{})}
