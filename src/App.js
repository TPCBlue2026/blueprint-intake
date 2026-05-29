import React, { useState, useEffect } from "react";

const Q='#5B6D4A',D='#27231E',BG='#FBF8F1',BR='#94431C',TX='#4D433B',MU='#8B7B6F',BO='rgba(107,63,42,0.15)';
const FORMSPREE='https://formspree.io/f/xgoqqepp';

/* ─── Pages data ──────────────────────────────────────── */
const PAGES=[
  {num:'01',id:'home',name:'Home',
    sections:[
      {id:'hero',name:'Hero',sub:'What you do + where you serve',
        why:'The first thing a visitor reads. For a local service business, clarity wins over cleverness — name the service and signal the location. That qualifies you in seconds.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[service area]'}${p.since?' since '+p.since:''}. My ideal customer is ${p.ideal||'[ideal customer]'}. Write 5 homepage headline options that immediately communicate what I do and where I serve. Each under 14 words. Lead with the service and location. Clear over clever. Tone: ${p.tone||'direct, professional, approachable'}.`,
        fields:[
          {id:'headline',label:'Headline',type:'text',guidance:'8–14 words',ph:'e.g. Professional Lawn Care for Austin and Surrounding Areas'},
          {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'Name one key differentiator — response time, years in business, a guarantee, or a certification.'},
          {id:'cta1',label:'Primary CTA button text',type:'text',guidance:'3–5 words',ph:'e.g. Get a Free Quote'},
          {id:'cta2',label:'Secondary CTA text',type:'text',guidance:'3–5 words',ph:'e.g. See Our Services'},
          {id:'area',label:'Service area callout',type:'text',guidance:'10–20 words',ph:'e.g. Serving Austin, Round Rock, Cedar Park, and surrounding areas'},
        ]},
      {id:'trust',name:'Trust strip',sub:'Quick credibility signals',
        why:'A scannable row of 3–4 trust markers just below the hero. Hits the credibility notes that matter most to local buyers before they have processed anything else on the page.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} in ${p.area||'[area]'}${p.since?' (in business since '+p.since+')':''}. My facts: [add your years in business, job count, Google rating and review count, licenses, insurance, certifications]. Write 3–4 short trust strip markers — each 5–10 words max. Scannable, specific, no marketing language. Tone: ${p.tone||'direct and confident'}.`,
        fields:[
          {id:'markers',label:'Trust markers',type:'rep',guidance:'3–4 markers · 5–10 words each',ph:'e.g. Serving Austin since 2012',min:3,max:4},
        ]},
      {id:'svc_ov',name:'Services overview',sub:'What you offer',
        why:'2–3 service cards giving visitors a quick look at your menu. The goal is recognition — they see their need and want to learn more.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[area]'}. I offer these services: [list each service]. For each one, write a 1–2 sentence homepage teaser. Confirm what\'s included and what the result looks like. Short enough to fit on a card. Tone: ${p.tone||'clear, professional, direct'}.`,
        fields:[
          {id:'cards',label:'Service cards',type:'cards',guidance:'2–3 services',min:2,max:3,lbl:'Service',
            subs:[
              {id:'name',label:'Service name',ph:'e.g. Lawn Mowing',guidance:'3–6 words'},
              {id:'desc',label:'Description',ph:'What\'s included and what the result looks like.',guidance:'20–35 words',multi:true},
            ]},
        ]},
      {id:'why_us',name:'Why choose us',sub:'Your differentiators',
        why:'Answers the question every local buyer is silently asking: "Why you instead of the next result?" Generic answers do not work here. Specific, verifiable ones do.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[area]'}. What genuinely sets us apart from other ${p.type||'businesses'} in our area: ${p.differentiator||'[describe what makes you different]'}. Write 3–4 short differentiator statements for my website. 10–20 words each. Specific and verifiable — not "we care about our customers" but something a competitor couldn\'t also claim. Tone: ${p.tone||'confident, direct'}.`,
        fields:[
          {id:'diffs',label:'Differentiators',type:'rep',guidance:'3–4 items · 10–20 words each',ph:'e.g. Same-day quotes, guaranteed — we respond within 24 hours, every time.',min:3,max:4},
        ]},
      {id:'photos',name:'Work samples',sub:'Photo proof',
        why:'For local service businesses, photos are often the single most persuasive element on the page. Before/after pairs are especially powerful.',
        fields:[
          {id:'pnote',label:'Your project photos',type:'upnote',guidance:'4–6 photos · before/after pairs preferred · high resolution'},
          {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe the photos you uploaded — e.g. "6 before/after photos, 3 lawn jobs and 3 garden installs, all labeled."'},
        ]},
      {id:'revs',name:'Testimonials',sub:'Social proof',
        why:'Local specificity makes reviews credible. Prioritize reviews that mention the specific service, a tangible result, or a location.',
        fields:[
          {id:'revlist',label:'Reviews',type:'cards',guidance:'3 reviews · 40–100 words each',min:3,max:3,lbl:'Review',
            subs:[
              {id:'text',label:'Review text',ph:'The full review. Prioritize reviews mentioning a specific service, result, or location.',guidance:'40–100 words',multi:true},
              {id:'rname',label:'Reviewer\'s first name',ph:'e.g. Mike',guidance:''},
              {id:'city',label:'City or neighborhood',ph:'e.g. Cedar Park',guidance:''},
            ]},
        ]},
      {id:'homecta',name:'Closing CTA',sub:'The final push',
        why:'At this point they have seen your work, read your reviews, and confirmed you cover their area. Make the next step obvious.',
        fields:[
          {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to get started? Your free quote takes under 2 minutes.'},
          {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'e.g. Get a Free Quote'},
        ]},
    ]},
  {num:'02',id:'about',name:'About',
    sections:[
      {id:'abouthero',name:'Hero',sub:'Community-rooted headline',
        why:'Local buyers want to hire local. The strongest opening leads with your connection to the community — not a company tagline.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} that has been serving ${p.area||'[area]'}${p.since?' since '+p.since:''}. Write 5 About page opening headline options that lead with local community connection. Warm, grounded, specific to the area. Under 14 words each. Avoid corporate language. Tone: ${p.tone||'human, trustworthy, proud without being boastful'}.`,
        fields:[
          {id:'headline',label:'Opening headline',type:'text',guidance:'6–14 words',ph:'e.g. Proudly Serving Austin Homeowners Since 2009'},
        ]},
      {id:'story',name:'Our story',sub:'The origin',
        why:'Local buyers connect with local stories. Knowing why you started makes your business feel real — not just another option on Google.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}${p.owner?', owned by '+p.owner:''}. Here is our background: [share your story — how you started, what you did before, why you care about this work]. What genuinely sets us apart: ${p.differentiator||'[your differentiator]'}. My ideal customer is ${p.ideal||'[ideal customer]'}. Write a 150–180 word business origin story for my About page. First person or "we." Honest, warm, grounded in real details. Should make a local ${p.area||''} homeowner or business owner feel like they are hiring a real person, not a faceless company. Tone: ${p.tone||'direct, human, trustworthy'}.`,
        fields:[
          {id:'story',label:'Business origin story',type:'textarea',guidance:'120–200 words',ph:'Tell the story of how and why you started. Include what drew you to this work, what you believe about doing the job right, and what keeps you going.'},
        ]},
      {id:'creds',name:'Credentials',sub:'Licensed, insured, certified',
        why:'For local service businesses, credentials are expected. A homeowner hiring a contractor needs to know they are protected if something goes wrong.',
        fields:[
          {id:'credlist',label:'Credentials and professional standing',type:'rep',guidance:'List each credential clearly',ph:'e.g. General Liability Insurance — $2M coverage',min:1,max:10},
        ]},
      {id:'svcarea',name:'Service area',sub:'Where you work',
        why:'Critical for local SEO and for immediately qualifying visitors. Be complete — if you serve a small neighboring town, include it.',
        fields:[
          {id:'area',label:'Service area',type:'textarea',guidance:'Every city, town, or zip code — or describe your radius',ph:'e.g. Austin, Round Rock, Cedar Park, Pflugerville, Georgetown, and surrounding areas within 30 miles.'},
        ]},
      {id:'aboutcta',name:'Closing CTA',sub:'End of About page',
        why:'Every page ends with the same ask. A visitor who has read this far trusts you enough to take the next step.',
        fields:[
          {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to get started? Request your free quote today.'},
          {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Get a Free Quote'},
        ]},
    ]},
  {num:'03',id:'services',name:'Services',
    sections:[
      {id:'svchero',name:'Hero',sub:'Direct headline and intro',
        why:'Visitors land here to confirm you do the specific service they need. Be direct and specific immediately.',
        fields:[
          {id:'headline',label:'Headline',type:'text',guidance:'4–10 words',ph:'e.g. Services Built for Every Size Job'},
          {id:'intro',label:'Intro paragraph',type:'textarea',guidance:'25–45 words',ph:'Confirm you do the work they are looking for. End with a nudge toward the quote form.'},
        ]},
      {id:'svclist',name:'Services list',sub:'Each service in detail',
        why:'Visitors want to know exactly what is included before submitting a quote. Be specific about scope.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[area]'}. For each of my services: [list them]. Write a scope description covering exactly what is included. Be concrete — local buyers want to know what they are getting. 40–80 words per service. Tone: ${p.tone||'clear, professional, specific'}.`,
        fields:[
          {id:'svcs',label:'Services',type:'cards',guidance:'2–5 services',min:2,max:5,lbl:'Service',
            subs:[
              {id:'name',label:'Service name',ph:'e.g. Full Lawn Maintenance',guidance:'3–6 words'},
              {id:'scope',label:'Scope description',ph:'What is specifically included. Be concrete.',guidance:'40–80 words',multi:true},
            ]},
        ]},
      {id:'faq',name:'FAQ',sub:'Common questions answered',
        why:'FAQs handle objections before the visitor has to ask. The right questions pre-qualify leads and reduce back-and-forth before the quote.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[area]'}. Write 4–5 FAQ questions and answers for my Services page. These should address the most common hesitations and questions from ${p.ideal||'local homeowners'} before they request a quote. Make each answer direct and specific. 30–60 words per answer. Tone: ${p.tone||'straightforward, helpful, honest'}.`,
        fields:[
          {id:'faqs',label:'FAQ items',type:'cards',guidance:'3–6 questions',min:3,max:6,lbl:'Question',
            subs:[
              {id:'q',label:'Question',ph:'e.g. Do you provide free estimates?',guidance:''},
              {id:'a',label:'Answer',ph:'A direct, specific answer. If it is true, say it plainly.',guidance:'30–80 words',multi:true},
            ]},
        ]},
      {id:'svccta',name:'Closing CTA',sub:'',
        why:'They have seen your services and read your FAQs — make the next step obvious.',
        fields:[
          {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Got a project in mind? Get a free quote — no obligation.'},
          {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Get a Free Quote'},
        ]},
    ]},
  {num:'04',id:'quote',name:'Get a Quote',
    sections:[
      {id:'quotehero',name:'Hero',sub:'Low-friction headline',
        why:'Sets the expectation before the visitor sees the form. Address the biggest hesitation: "this is going to be complicated."',
        fields:[
          {id:'headline',label:'Headline',type:'text',guidance:'6–12 words',ph:'e.g. Get your free quote in under 2 minutes.'},
        ]},
      {id:'process',name:'What happens next',sub:'3-step process preview',
        why:'Removes the "then what?" anxiety. When visitors know exactly what happens after they submit, they are far more likely to follow through.',
        prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[area]'}. I am writing a "What happens next" section for my quote request page. My actual process after someone submits: [describe — do you call or email? How quickly? Do you come out for an assessment or quote by phone? When do they receive the quote?]. Write a 3-step process that sets clear expectations. Step 1 is filling out the form. Be specific about my actual timeline. 15–25 words per step. Tone: ${p.tone||'clear, reassuring, professional'}.`,
        fields:[
          {id:'steps',label:'Process steps',type:'cards',guidance:'Exactly 3 steps · 15–25 words each',min:3,max:3,lbl:'Step',
            subs:[
              {id:'title',label:'Step title',ph:'e.g. Fill out the form',guidance:'3–6 words'},
              {id:'desc',label:'Description',ph:'Be specific about your actual process and timeline.',guidance:'15–25 words',multi:true},
            ]},
        ]},
      {id:'formfields',name:'Quote form fields',sub:'What information do you need?',
        why:'5–7 fields is the sweet spot. Every field should earn its place — if you cannot produce a more accurate quote because of the answer, cut the field.',
        fields:[
          {id:'checks',label:'Fields to include',type:'checks',options:['Service needed (dropdown)','Property address or zip code','Scope details (size, quantity, specifics)','Preferred timeline or start date','Name','Phone number','Email address','Anything else? (optional open text)']},
          {id:'dropdown',label:'Service dropdown options',type:'rep',guidance:'List each option clients can select',ph:'e.g. Lawn Mowing',min:1,max:10},
          {id:'pref',label:'Preferred response method',type:'sel',options:['Phone','Email','Either — up to the client']},
        ]},
      {id:'trustnote',name:'Trust reinforcement',sub:'Below the form',
        why:'Catches hesitant visitors right at the moment of commitment. A small reassurance just before Submit can be the difference between submission and abandonment.',
        fields:[
          {id:'note',label:'Reassurance note',type:'textarea',guidance:'15–30 words',ph:'e.g. We respond within 24 hours. Your quote is completely free and comes with no obligation.'},
        ]},
    ]},
  {num:'05',id:'contact',name:'Contact',
    sections:[
      {id:'conthero',name:'Headline and statement',sub:'',
        why:'Many local buyers prefer to call before committing to a form. This page is the safety valve for those visitors.',
        fields:[
          {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. Let\'s Talk About Your Project'},
          {id:'statement',label:'Brief statement',type:'textarea',guidance:'20–40 words',ph:'Warm and direct. Lead with an invitation to call or reach out. A gentle nudge toward the quote form is appropriate.'},
        ]},
      {id:'phone',name:'Phone and hours',sub:'Primary contact info',
        why:'Many local buyers will call before they fill out a form. A prominently displayed, tap-to-call phone number is a conversion tool on mobile.',
        fields:[
          {id:'ph',label:'Business phone number',type:'text',guidance:'',ph:'e.g. (512) 555-0123'},
          {id:'hours',label:'Business hours',type:'textarea',guidance:'',ph:'Monday – Friday: 8am – 6pm\nSaturday: 9am – 3pm\nSunday: Closed'},
        ]},
      {id:'contarea',name:'Service area',sub:'For the Contact page',
        why:'Keeps qualified visitors from leaving because they could not confirm you serve their area.',
        fields:[
          {id:'area',label:'Service area (contact page)',type:'textarea',guidance:'Can be same as About page, condensed',ph:'Same cities/radius as About page, or a shorter version.'},
        ]},
      {id:'social',name:'Social and business links',sub:'',
        why:'Makes it easy for visitors to find you on the platforms where they already spend time.',
        fields:[
          {id:'google',label:'Google Business Profile URL',type:'text',guidance:'',ph:'https://g.page/...'},
          {id:'links',label:'Social media links',type:'cards',guidance:'Each platform you are active on',min:1,max:5,lbl:'Platform',
            subs:[
              {id:'platform',label:'Platform',ph:'e.g. Instagram',guidance:''},
              {id:'url',label:'URL',ph:'https://instagram.com/...',guidance:''},
            ]},
        ]},
    ]},
];

const ALL=PAGES.flatMap(p=>p.sections.map(s=>({...s,page:p})));

/* ─── Helpers ──────────────────────────────────────────── */
function getParam(key){
  try{const u=new URLSearchParams(window.location.search);return u.get(key)||'';}catch{return '';}
}

function buildPayload(profile,data){
  const payload={
    _subject:`Quote Blueprint (Emerge) — ${profile.biz||'New Client'} Content Submission`,
    _format:'plain',
    '--- Business Profile ---':'',
    'Business name':profile.biz||'(not provided)',
    'Owner name':profile.owner||'(not provided)',
    'Business type':profile.type||'(not provided)',
    'Service area':profile.area||'(not provided)',
    'In business since':profile.since||'(not provided)',
    'Ideal customer':profile.ideal||'(not provided)',
    'Key differentiator':profile.differentiator||'(not provided)',
    'Tone':profile.tone||'(not provided)',
    '--- Website Content ---':'',
  };
  PAGES.forEach(page=>{
    page.sections.forEach(sec=>{
      sec.fields.forEach(f=>{
        if(f.type==='upnote')return;
        const prefix=`[Page ${page.num} — ${page.name}] ${sec.name}`;
        const val=data[sec.id]?.[f.id];
        if(f.type==='rep'){
          const items=(val||[]).filter(Boolean);
          payload[`${prefix} · ${f.label}`]=items.length>0?items.map((v,i)=>`${i+1}. ${v}`).join('\n'):'(not provided)';
        }else if(f.type==='cards'){
          const items=val||[];
          if(items.length===0){payload[`${prefix} · ${f.label}`]='(not provided)';}
          else{items.forEach((card,i)=>{f.subs.forEach(sub=>{payload[`${prefix} · ${f.lbl||'Item'} ${i+1} — ${sub.label}`]=card[sub.id]||'(not provided)';});});}
        }else if(f.type==='checks'){
          payload[`${prefix} · ${f.label}`]=(val||[]).length>0?(val||[]).join(', '):'(none selected)';
        }else{
          payload[`${prefix} · ${f.label}`]=val||'(not provided)';
        }
      });
    });
  });
  return payload;
}

function wc(t){return t?t.trim().split(/\s+/).filter(Boolean).length:0;}
function wcRange(g){const m=(g||'').match(/\d+/g);return m&&m.length>=2?[+m[0],+m[m.length-1]]:null;}

/* ─── Sub-components ───────────────────────────────────── */
function WC({text,guidance}){
  const c=wc(text||''),r=wcRange(guidance||'');
  if(!r)return<span style={st.wc}>{c} words</span>;
  const[mn,mx]=r;
  return<span style={{...st.wc,color:c>=mn&&c<=mx?Q:c>mx?BR:MU}}>{c} / {guidance}</span>;
}

function Repeater({value=[],onChange,ph,min=1,max=5}){
  const items=value.length>0?value:Array(min).fill('');
  const upd=(i,v)=>{const n=[...items];n[i]=v;onChange(n);};
  return<div>
    {items.map((it,i)=><div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
      <input style={st.input} value={it} onChange={e=>upd(i,e.target.value)} placeholder={ph}/>
      {items.length>min&&<button style={st.xbtn} onClick={()=>onChange(items.filter((_,j)=>j!==i))}>✕</button>}
    </div>)}
    {items.length<max&&<button style={st.addbtn} onClick={()=>onChange([...items,''])}>+ Add another</button>}
  </div>;
}

function Cards({value=[],onChange,subs,min=1,max=5,lbl='Item'}){
  const mk=()=>Object.fromEntries(subs.map(s=>[s.id,'']));
  const items=value.length>0?value:Array(Math.max(min,1)).fill(null).map(mk);
  const upd=(i,fid,v)=>onChange(items.map((it,j)=>j===i?{...it,[fid]:v}:it));
  return<div>
    {items.map((it,i)=><div key={i} style={st.card}>
      <div style={st.cardHd}>
        <span>{lbl} {i+1}</span>
        {items.length>min&&<button style={{...st.xbtn,width:22,height:22,fontSize:11}} onClick={()=>onChange(items.filter((_,j)=>j!==i))}>✕</button>}
      </div>
      {subs.map(sub=><div key={sub.id} style={{marginBottom:10}}>
        <div style={st.cardLabel}>
          <span>{sub.label}</span>
          {sub.guidance&&<span style={st.hint}>{sub.guidance}</span>}
        </div>
        {sub.multi
          ?<><textarea style={{...st.input,minHeight:68,resize:'vertical',lineHeight:1.6}} value={it[sub.id]||''} onChange={e=>upd(i,sub.id,e.target.value)} placeholder={sub.ph}/>{sub.guidance&&<WC text={it[sub.id]||''} guidance={sub.guidance}/>}</>
          :<input style={st.input} value={it[sub.id]||''} onChange={e=>upd(i,sub.id,e.target.value)} placeholder={sub.ph}/>}
      </div>)}
    </div>)}
    {items.length<max&&<button style={st.addbtn} onClick={()=>onChange([...items,mk()])}>+ Add another</button>}
  </div>;
}

function DriveButton({driveUrl}){
  if(!driveUrl)return<div style={{background:'rgba(107,63,42,0.06)',border:`1px dashed ${BO}`,borderRadius:2,padding:'12px 16px',fontSize:13,color:MU,fontStyle:'italic'}}>No project folder linked. Victoria will add your Drive folder link before sending this intake.</div>;
  return<button onClick={()=>window.open(driveUrl,'_blank','noopener,noreferrer')} style={{background:Q,color:'white',border:'none',borderRadius:2,padding:'10px 18px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>
    📁 Open my project folder →
  </button>;
}

function Field({f,val,onChange,driveUrl}){
  if(f.type==='text')return<input style={st.input} value={val||''} onChange={e=>onChange(e.target.value)} placeholder={f.ph}/>;
  if(f.type==='textarea')return<><textarea style={{...st.input,minHeight:88,resize:'vertical',lineHeight:1.6}} value={val||''} onChange={e=>onChange(e.target.value)} placeholder={f.ph}/>{f.guidance&&f.guidance!=='Optional'&&<WC text={val||''} guidance={f.guidance}/>}</>;
  if(f.type==='rep')return<Repeater value={val} onChange={onChange} ph={f.ph} min={f.min||1} max={f.max||8}/>;
  if(f.type==='cards')return<Cards value={val} onChange={onChange} subs={f.subs} min={f.min||1} max={f.max||5} lbl={f.lbl||'Item'}/>;
  if(f.type==='checks')return<div>{f.options.map(o=>{const chk=(val||[]).includes(o);return<label key={o} style={{display:'flex',alignItems:'center',gap:9,marginBottom:9,fontSize:13.5,cursor:'pointer',color:TX}}><input type="checkbox" checked={chk} style={{width:14,height:14,accentColor:Q,cursor:'pointer',flexShrink:0}} onChange={()=>onChange(chk?(val||[]).filter(x=>x!==o):[...(val||[]),o])}/>{o}</label>})}</div>;
  if(f.type==='sel')return<select style={{...st.input,cursor:'pointer'}} value={val||''} onChange={e=>onChange(e.target.value)}><option value="">Select one</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
  if(f.type==='upnote')return<div style={{marginBottom:12}}>
    <DriveButton driveUrl={driveUrl}/>
    <div style={{marginTop:8,fontSize:12,color:MU,fontFamily:'DM Mono, monospace',letterSpacing:'0.04em'}}>{f.guidance}</div>
  </div>;
  return null;
}

/* ─── Styles ───────────────────────────────────────────── */
const st={
  input:{width:'100%',background:'#fff',border:`1px solid ${BO}`,borderRadius:2,padding:'8px 11px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,color:D,outline:'none',boxSizing:'border-box'},
  xbtn:{background:'none',border:`1px solid ${BO}`,borderRadius:2,width:32,height:34,cursor:'pointer',color:MU,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13},
  addbtn:{background:'none',border:`1px dashed ${BO}`,borderRadius:2,padding:'6px 12px',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:MU,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5,marginTop:4},
  card:{background:'#fff',border:`1px solid ${BO}`,borderRadius:2,padding:13,marginBottom:9},
  cardHd:{fontFamily:'DM Mono, monospace',fontSize:9.5,letterSpacing:'0.08em',textTransform:'uppercase',color:MU,marginBottom:9,display:'flex',justifyContent:'space-between',alignItems:'center'},
  cardLabel:{fontSize:12,fontWeight:500,color:TX,marginBottom:3,display:'flex',justifyContent:'space-between'},
  hint:{fontFamily:'DM Mono, monospace',fontSize:10,color:MU},
  wc:{fontFamily:'DM Mono, monospace',fontSize:10,color:MU,marginTop:3,display:'block'},
};

const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,350&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400&display=swap');`;
const INTAKE_CSS=`
  *{box-sizing:border-box;margin:0;padding:0;}
  input,textarea,select{font-family:'Instrument Sans',sans-serif;}
  input:focus,textarea:focus,select:focus{outline:none;border-color:${Q}!important;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:rgba(107,63,42,0.2);border-radius:2px;}
  .sb-s{padding:4px 12px 4px 20px;font-size:11.5px;color:rgba(255,255,255,0.38);cursor:pointer;display:flex;align-items:center;gap:7px;border-left:2px solid transparent;transition:all 0.15s;font-family:'Instrument Sans',sans-serif;}
  .sb-s:hover{color:rgba(255,255,255,0.7);}
  .sb-s.on{color:#fff;border-left-color:${Q};background:rgba(91,109,74,0.15);}
  .sb-s.dn{color:rgba(255,255,255,0.28);}
  .addbtn:hover{border-color:${Q}!important;color:${Q}!important;}
  .ai-btn:hover{border-color:${BR}!important;color:${BR}!important;}
  .btn-p:hover:not(:disabled){background:#4a5b3c!important;}
  .btn-s:hover:not(:disabled){border-color:${TX}!important;}
  .lp-btn:hover{background:#4a5b3c!important;}
  .gen-btn:hover{background:#4a5b3c!important;}
  .copy-btn:hover{background:rgba(91,109,74,0.15)!important;}
`;

/* ─── Link Generator Page ──────────────────────────────── */
function LinkGenerator({onBack}){
  const[drive,setDrive]=useState('');
  const[copied,setCopied]=useState(false);
  const base=window.location.href.split('?')[0];
  const link=drive?`${base}?drive=${encodeURIComponent(drive)}`:base;
  const copy=()=>{navigator.clipboard.writeText(link).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
  return<div style={{minHeight:'100vh',background:BG,fontFamily:'Instrument Sans, sans-serif',color:TX}}>
    <div style={{height:50,background:D,display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
      <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:Q,background:'rgba(91,109,74,0.2)',padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>Link Generator</span>
    </div>
    <div style={{maxWidth:560,margin:'0 auto',padding:'48px 24px'}}>
      <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:8}}>For Victoria</div>
      <h1 style={{fontFamily:'Fraunces, serif',fontSize:26,fontWeight:350,color:D,marginBottom:8}}>Generate a client intake link</h1>
      <p style={{fontSize:14,color:MU,lineHeight:1.7,marginBottom:32}}>Create the link you send to a Quote Blueprint client after their discovery call. Paste their Google Drive folder link below and copy the result.</p>

      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:500,color:D,marginBottom:6}}>Client Google Drive folder link</div>
        <input style={st.input} value={drive} onChange={e=>setDrive(e.target.value)} placeholder='Paste the shared Drive folder URL here'/>
        <div style={{fontSize:12,color:MU,marginTop:5}}>Make sure the folder is set to "Anyone with the link can view" before sending.</div>
      </div>

      <div style={{background:'#fff',border:`1px solid ${BO}`,borderRadius:2,padding:16,marginBottom:16}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:MU,marginBottom:8}}>Generated link</div>
        <div style={{fontSize:13,color:drive?D:MU,wordBreak:'break-all',lineHeight:1.6,marginBottom:12}}>{link}</div>
        <button className="copy-btn" onClick={copy} style={{background:copied?'rgba(91,109,74,0.1)':'rgba(91,109,74,0.06)',border:`1px solid ${BO}`,borderRadius:2,padding:'7px 14px',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:Q,cursor:'pointer',transition:'all 0.15s'}}>
          {copied?'✓ Copied!':'Copy link'}
        </button>
      </div>

      <div style={{background:'rgba(91,109,74,0.06)',borderLeft:`2px solid ${Q}`,borderRadius:'0 2px 2px 0',padding:'12px 16px',fontSize:13,color:TX,lineHeight:1.65}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:4}}>How to use</div>
        Paste their Drive folder link above, copy the generated link, and send it to the client in their welcome email. When they open it, their intake will automatically connect to their project folder.
      </div>
      <div style={{marginTop:32}}>
        <button onClick={onBack} style={{background:'none',border:'none',padding:0,fontFamily:'Instrument Sans, sans-serif',fontSize:13,color:MU,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}}>← Back to client view</button>
      </div>
    </div>
  </div>;
}

/* ─── Landing Page ─────────────────────────────────────── */
function LandingPage({onStart,driveUrl,onGenerator}){
  const checklist=['Your best completed job photos (4–6, before/after pairs if you have them)','3 reviews pulled from Google or wherever you collect them','Your list of services and what each one includes','Your credentials — license number, insurance, any certifications','Your service area — every city, town, or zip code you cover','Your business phone number and hours'];
  return<div style={{minHeight:'100vh',background:BG,fontFamily:'Instrument Sans, sans-serif',color:TX}}>
    <div style={{height:50,background:D,display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
      <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:Q,background:'rgba(91,109,74,0.2)',padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>Quote Blueprint · Emerge</span>
    </div>
    <div style={{maxWidth:600,margin:'0 auto',padding:'52px 24px 60px'}}>
      <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:10}}>Your website starts here</div>
      <h1 style={{fontFamily:'Fraunces, serif',fontSize:32,fontWeight:350,color:D,lineHeight:1.2,marginBottom:16}}>Let's build your site.<br/>Start with your content.</h1>
      <p style={{fontSize:15,color:TX,lineHeight:1.75,marginBottom:12}}>This intake walks you through every section of your Quote Blueprint site — one at a time, in the same order your site is built. For each section you will find clear guidance on what to write, how long it should be, and why it matters.</p>
      <p style={{fontSize:15,color:TX,lineHeight:1.75,marginBottom:32}}>When you submit, Victoria receives everything organized and ready to build from. Most clients finish in <strong>45–60 minutes</strong>. Take your time — there is no rush.</p>

      <div style={{background:'#fff',border:`1px solid ${BO}`,borderRadius:2,padding:20,marginBottom:32}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:14}}>Before you start — have these ready</div>
        {checklist.map((item,i)=><div key={i} style={{display:'flex',gap:12,marginBottom:10,fontSize:13.5,color:TX,lineHeight:1.5}}>
          <div style={{width:20,height:20,background:'rgba(91,109,74,0.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,color:Q,fontWeight:500,marginTop:1}}>{i+1}</div>
          {item}
        </div>)}
      </div>

      {driveUrl&&<div style={{background:'rgba(91,109,74,0.06)',border:`1px solid rgba(91,109,74,0.2)`,borderRadius:2,padding:16,marginBottom:28,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:3}}>Your project folder</div>
          <div style={{fontSize:13,color:TX}}>Upload your photos and files here as you go through the intake.</div>
        </div>
        <button onClick={()=>window.open(driveUrl,'_blank','noopener,noreferrer')} style={{background:Q,color:'white',border:'none',borderRadius:2,padding:'8px 16px',fontFamily:'Instrument Sans, sans-serif',fontSize:13,fontWeight:500,cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',gap:6}}>
          📁 Open folder →
        </button>
      </div>}

      <div style={{background:D,borderRadius:2,padding:'16px 20px',marginBottom:32,fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:1.7}}>
        <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,display:'block',marginBottom:4}}>Good to know</span>
        Each section includes an AI writing prompt pre-loaded with your business info. If you get stuck on any section, expand the prompt, copy it, and paste it into Claude or ChatGPT for a strong first draft — then make it yours.
      </div>

      <button className="lp-btn" onClick={onStart} style={{background:Q,color:'white',border:'none',borderRadius:2,padding:'14px 32px',fontFamily:'Fraunces, serif',fontSize:18,fontWeight:350,cursor:'pointer',letterSpacing:'0.01em',transition:'background 0.15s',display:'inline-flex',alignItems:'center',gap:10}}>
        Start my intake →
      </button>
      <div style={{marginTop:40,paddingTop:24,borderTop:`1px solid ${BO}`}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:MU,marginBottom:8}}>For Victoria</div>
        <button onClick={onGenerator} style={{background:'none',border:'none',padding:0,fontFamily:'Instrument Sans, sans-serif',fontSize:13,color:Q,cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>Generate a client intake link →</button>
      </div>
    </div>
  </div>;
}

/* ─── Business Profile Step ────────────────────────────── */
const TONE_OPTIONS=['Professional and polished','Warm and approachable','Straight-talking and no-nonsense','Friendly and conversational','Confident and straightforward'];

function ProfileStep({profile,setProfile,onNext}){
  const upd=(k,v)=>setProfile(p=>({...p,[k]:v}));
  const pf=(label,key,ph,hint)=><div style={{marginBottom:20}}>
    <div style={{fontSize:13,fontWeight:500,color:D,marginBottom:4}}>{label}</div>
    {hint&&<div style={{fontSize:12,color:MU,marginBottom:6}}>{hint}</div>}
    <input style={st.input} value={profile[key]||''} onChange={e=>upd(key,e.target.value)} placeholder={ph}/>
  </div>;
  return<div style={{flex:1,overflowY:'auto',padding:'26px 34px 40px',background:BG}}>
    <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:6}}>Step 01 of 02</div>
    <h1 style={{fontFamily:'Fraunces, serif',fontSize:23,fontWeight:350,color:D,lineHeight:1.2,margin:'0 0 4px'}}>Business profile</h1>
    <p style={{fontSize:13,color:MU,marginBottom:20}}>This information pre-fills every AI writing prompt throughout the intake so the drafts sound like you.</p>
    <div style={{background:'rgba(91,109,74,0.08)',borderLeft:`2px solid ${Q}`,padding:'10px 14px',marginBottom:24,fontSize:13,lineHeight:1.65,color:TX}}>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,display:'block',marginBottom:4}}>How this is used</span>
      Everything you enter here stays in this intake session only. It is used to personalize the AI prompts so generated copy reflects your actual business — not a generic template.
    </div>
    {pf('Business name','biz','e.g. Austin Greenworks',null)}
    {pf('Your name (owner)','owner','e.g. Marcus Johnson',null)}
    {pf('Type of business','type','e.g. landscaping company, house cleaning service, painting contractor','What do you do? Be specific.')}
    {pf('Primary service area','area','e.g. Austin, Round Rock, Cedar Park and surrounding areas',null)}
    {pf('In business since','since','e.g. 2014',null)}
    {pf('Your ideal customer','ideal','e.g. busy homeowners in the Austin suburbs who want reliable, show-up-on-time service','Who is the person most likely to hire you?')}
    <div style={{marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:500,color:D,marginBottom:4}}>What sets you apart</div>
      <div style={{fontSize:12,color:MU,marginBottom:6}}>The one or two things that genuinely differentiate you from other businesses doing the same work in your area.</div>
      <textarea style={{...st.input,minHeight:72,resize:'vertical',lineHeight:1.6}} value={profile.differentiator||''} onChange={e=>upd('differentiator',e.target.value)} placeholder='e.g. We guarantee same-day quotes, show up on time every time, and always follow up after the job to make sure the client is happy.'/>
    </div>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:13,fontWeight:500,color:D,marginBottom:8}}>Tone preference</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {TONE_OPTIONS.map(t=><button key={t} onClick={()=>upd('tone',t)} style={{background:profile.tone===t?Q:'#fff',color:profile.tone===t?'white':TX,border:`1px solid ${profile.tone===t?Q:BO}`,borderRadius:2,padding:'7px 14px',fontFamily:'Instrument Sans, sans-serif',fontSize:13,cursor:'pointer',transition:'all 0.15s'}}>{t}</button>)}
      </div>
    </div>
    <button className="btn-p" onClick={onNext} style={{background:Q,color:'#fff',border:'none',borderRadius:2,padding:'10px 24px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
      Start content intake →
    </button>
  </div>;
}

/* ─── Main Intake ──────────────────────────────────────── */
function Intake({profile,driveUrl}){
  const[step,setStep]=useState(0);
  const[data,setData]=useState({});
  const[done,setDone]=useState(new Set());
  const[ai,setAi]=useState(false);
  const[submitted,setSubmitted]=useState(false);
  const[submitting,setSubmitting]=useState(false);
  const[error,setError]=useState('');
  const total=ALL.length;
  const cur=ALL[step];
  const pct=Math.round(done.size/total*100);
  const set=(sid,fid,v)=>setData(p=>({...p,[sid]:{...(p[sid]||{}),[fid]:v}}));
  const get=(sid,fid,def)=>data[sid]?.[fid]??def;
  const next=()=>{setDone(p=>new Set([...p,step]));setAi(false);if(step<total-1)setStep(step+1);};
  const back=()=>{setAi(false);if(step>0)setStep(step-1);};
  const jump=i=>{setAi(false);setStep(i);};
  const promptText=cur.prompt?cur.prompt(profile):'';

  const handleSubmit=async()=>{
    setSubmitting(true);setError('');setDone(p=>new Set([...p,step]));
    try{
      const res=await fetch(FORMSPREE,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(buildPayload(profile,data))});
      if(res.ok){setSubmitted(true);}else{setError('Something went wrong. Please try again.');}
    }catch(e){setError('Network error. Please check your connection and try again.');}
    finally{setSubmitting(false);}
  };

  if(submitted)return<div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:BG,textAlign:'center',padding:40}}>
    <div style={{width:52,height:52,background:Q,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,fontSize:22,color:'white'}}>✓</div>
    <h1 style={{fontFamily:'Fraunces, serif',fontSize:28,fontWeight:350,color:D,marginBottom:8}}>Content submitted</h1>
    <p style={{fontSize:14,color:MU,lineHeight:1.7,maxWidth:380,marginBottom:24}}>Your content is on its way to Victoria. She will review everything and be in touch within 2 business days. Your site will be live within two weeks of receiving complete content.</p>
    <div style={{padding:'14px 20px',background:'rgba(91,109,74,0.08)',borderRadius:2,borderLeft:`2px solid ${Q}`,fontSize:13,color:TX,maxWidth:380,textAlign:'left'}}>
      <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,marginBottom:6}}>What happens next</div>
      Victoria reviews your content and follows up with any clarifying questions. Once everything is confirmed, your build begins.
    </div>
  </div>;

  return<>
    <div style={{height:50,background:D,display:'flex',alignItems:'center',gap:12,padding:'0 20px',flexShrink:0}}>
      <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:Q,background:'rgba(91,109,74,0.2)',padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase',flexShrink:0}}>Quote · Emerge</span>
      <div style={{flex:1,height:3,background:'rgba(255,255,255,0.1)',borderRadius:2,overflow:'hidden'}}>
        <div style={{height:'100%',background:Q,width:pct+'%',transition:'width 0.4s ease'}}/>
      </div>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'rgba(255,255,255,0.35)',flexShrink:0}}>{done.size}/{total}</span>
    </div>
    <div style={{flex:1,display:'flex',overflow:'hidden'}}>
      <div style={{width:196,background:D,overflowY:'auto',flexShrink:0,padding:'8px 0 24px'}}>
        {PAGES.map(pg=>{
          const si=ALL.findIndex(s=>s.page.id===pg.id);
          return<div key={pg.id}>
            <div onClick={()=>jump(si)} style={{padding:'8px 14px 5px',fontFamily:'DM Mono, monospace',fontSize:9.5,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
              <span style={{fontSize:8.5,background:'rgba(255,255,255,0.07)',borderRadius:2,padding:'1px 5px'}}>{pg.num}</span>{pg.name}
            </div>
            {pg.sections.map(sec=>{
              const idx=ALL.findIndex(s=>s.id===sec.id&&s.page.id===pg.id);
              const isOn=idx===step,isDn=done.has(idx);
              return<div key={sec.id} className={`sb-s${isOn?' on':''}${isDn&&!isOn?' dn':''}`} onClick={()=>jump(idx)}>
                <div style={{width:5,height:5,borderRadius:'50%',background:isDn?Q:'rgba(255,255,255,0.15)',flexShrink:0}}/>
                {sec.name}
              </div>;
            })}
          </div>;
        })}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'26px 34px 40px',background:BG}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:Q}}>Page {cur.page.num} — {cur.page.name}</div>
        <h1 style={{fontFamily:'Fraunces, serif',fontSize:23,fontWeight:350,color:D,lineHeight:1.2,margin:'4px 0 2px'}}>{cur.name}</h1>
        {cur.sub&&<p style={{fontSize:13,color:MU,marginBottom:16}}>{cur.sub}</p>}
        {cur.why&&<div style={{background:'rgba(91,109,74,0.08)',borderLeft:`2px solid ${Q}`,padding:'10px 14px',marginBottom:22,fontSize:13,lineHeight:1.65,color:TX}}>
          <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:Q,display:'block',marginBottom:4}}>Why it matters</span>
          {cur.why}
        </div>}
        {cur.fields.map(f=><div key={f.id} style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:500,color:D,marginBottom:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{f.label}</span>
            {f.guidance&&(f.type==='text'||f.type==='sel'||f.type==='checks'||f.type==='rep')&&<span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:MU}}>{f.guidance}</span>}
          </div>
          <Field f={f} val={get(cur.id,f.id,f.type==='checks'||f.type==='cards'||f.type==='rep'?[]:'')} onChange={v=>set(cur.id,f.id,v)} driveUrl={driveUrl}/>
        </div>)}
        {promptText&&<div style={{marginTop:4}}>
          <button className="ai-btn" onClick={()=>setAi(!ai)} style={{background:'none',border:`1px solid ${BO}`,borderRadius:2,padding:'6px 12px',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:MU,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}}>
            ✦ AI writing prompt {ai?'↑':'↓'}
          </button>
          {ai&&<div style={{background:D,borderRadius:2,padding:14,marginTop:9}}>
            <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:7}}>Copy and paste into Claude or ChatGPT — your business info is already filled in</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.75)',lineHeight:1.75,fontStyle:'italic',whiteSpace:'pre-wrap'}}>{promptText}</div>
          </div>}
        </div>}
        {error&&<div style={{marginTop:16,padding:'10px 14px',background:'rgba(148,67,28,0.08)',borderLeft:`2px solid ${BR}`,borderRadius:2,fontSize:13,color:BR}}>{error}</div>}
      </div>
    </div>
    <div style={{height:60,background:'#fff',borderTop:`1px solid ${BO}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 34px',flexShrink:0}}>
      <button className="btn-s" onClick={back} disabled={step===0||submitting} style={{background:'none',color:TX,border:`1px solid ${BO}`,borderRadius:2,padding:'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,cursor:step===0?'not-allowed':'pointer',opacity:step===0?0.35:1,display:'flex',alignItems:'center',gap:6}}>← Back</button>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:MU}}>{cur.page.name} · {cur.name}</span>
      {step<total-1
        ?<button className="btn-p" onClick={next} style={{background:Q,color:'#fff',border:'none',borderRadius:2,padding:'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>Next →</button>
        :<button className="btn-p" onClick={handleSubmit} disabled={submitting} style={{background:submitting?MU:Q,color:'#fff',border:'none',borderRadius:2,padding:'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:submitting?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,transition:'background 0.2s'}}>
          {submitting?'Sending…':'Submit content ✓'}
        </button>}
    </div>
  </>;
}

/* ─── App Shell ────────────────────────────────────────── */
export default function App(){
  const[screen,setScreen]=useState('landing'); // landing | profile | intake | generator
  const[profile,setProfile]=useState({});
  const driveUrl=getParam('drive');
  const isGenerator=getParam('generator')==='true';

  useEffect(()=>{if(isGenerator)setScreen('generator');},[]);

  return<>
    <style>{FONTS+INTAKE_CSS}</style>
    <div style={{height:'100vh',display:'flex',flexDirection:'column',fontFamily:'Instrument Sans, sans-serif'}}>
      {screen==='generator'&&<LinkGenerator onBack={()=>setScreen('landing')}/>}
      {screen==='landing'&&<LandingPage onStart={()=>setScreen('profile')} driveUrl={driveUrl} onGenerator={()=>setScreen('generator')}/>}
      {screen==='profile'&&<div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{height:50,background:D,display:'flex',alignItems:'center',gap:12,padding:'0 20px',flexShrink:0}}>
          <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
          <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:Q,background:'rgba(91,109,74,0.2)',padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>Quote · Emerge</span>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          <ProfileStep profile={profile} setProfile={setProfile} onNext={()=>setScreen('intake')}/>
        </div>
      </div>}
      {screen==='intake'&&<div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
        <Intake profile={profile} driveUrl={driveUrl}/>
      </div>}
    </div>
  </>;
}
