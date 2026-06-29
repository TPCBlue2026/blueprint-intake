import React, { useState, useEffect } from "react";

const D='#27231E',BG='#FBF8F1',TX='#4D433B',MU='#8B7B6F',BO='rgba(107,63,42,0.15)';
const FORMSPREE='https://formspree.io/f/xgoqqepp';

const BP_META = {
  quote:        { name:'Quote Blueprint',        color:'#5B6D4A', cta:'Get a Free Quote',     industry:'local service businesses' },
  consultation: { name:'Consultation Blueprint', color:'#AD6340', cta:'Book a Call',           industry:'coaches, consultants, therapists, advisors' },
  booking:      { name:'Booking Blueprint',      color:'#1A3A52', cta:'Book an Appointment',  industry:'salons, spas, appointment-based businesses' },
  inquiry:      { name:'Inquiry Blueprint',      color:'#7D5E50', cta:'Start Your Inquiry',   industry:'photographers, event vendors, creative businesses' },
  shop:         { name:'Shop Blueprint',         color:'#C98D26', cta:'Shop Now',             industry:'makers, artisans, product-based businesses' },
  speaker:      { name:'Speaker Blueprint',      color:'#5C4A6B', cta:'Inquire About Booking', industry:'professional speakers, trainers, and workshop facilitators' },
};

function getBlueprintPages(bp, tier) {
  const allEmerge = {
    quote: QUOTE_EMERGE, consultation: CONSULTATION_EMERGE,
    booking: BOOKING_EMERGE, inquiry: INQUIRY_EMERGE, shop: SHOP_EMERGE,
    speaker: SPEAKER_BLUEPRINT,
  };
  const allElevate = {
    quote: QUOTE_ELEVATE, consultation: CONSULTATION_ELEVATE,
    booking: BOOKING_ELEVATE, inquiry: INQUIRY_ELEVATE, shop: SHOP_ELEVATE,
    speaker: SPEAKER_BLUEPRINT,
  };
  return tier === 'elevate' ? (allElevate[bp] || allElevate.quote) : (allEmerge[bp] || allEmerge.quote);
}

function getParam(k){try{return new URLSearchParams(window.location.search).get(k)||'';}catch{return '';}}

function buildPayload(bp,tier,profile,data,pages,design){
  const meta=BP_META[bp]||BP_META.quote;
  const dd=DESIGN_DATA[bp]||DESIGN_DATA.quote;
  const selPal=dd.palettes.find(p=>p.id===(design?.paletteId||'A'))||dd.palettes[0];
  const selFont=dd.fonts.find(f=>f.id===(design?.fontId||'A'))||dd.fonts[0];
  const payload={
    _subject:`${meta.name} (${meta.name==='Speaker Blueprint'?'One-Page':(tier==='elevate'?'Elevate':'Emerge')}) — ${profile.biz||'New Client'} Submission`,
    _format:'plain',
    '--- Design Selections ---':'',
    'Color palette':`${selPal.name} — ${selPal.vibe} | Primary: ${selPal.primary} · BG: ${selPal.bg} · Dark: ${selPal.dark} · Text: ${selPal.text} · Accent: ${selPal.accent}`,
    'Font pairing':`${selFont.name} — ${selFont.vibe} | Heading: ${selFont.heading} · Body: ${selFont.body} · Eyebrow: ${selFont.eyebrow}`,
    '--- Business Profile ---':'',
    'Business name':profile.biz||'(not provided)',
    'Owner':profile.owner||'(not provided)',
    'Type':profile.type||'(not provided)',
    'Area':profile.area||'(not provided)',
    'Since':profile.since||'(not provided)',
    'Ideal customer':profile.ideal||'(not provided)',
    'Differentiator':profile.differentiator||'(not provided)',
    'Tone':profile.tone||'(not provided)',
    'Business email':profile.email||'(not provided)',
    'Business phone':profile.phone||'(not provided)',
    'Business address':profile.address||'(not provided)',
    'Existing website':profile.existingUrl||'(not provided)',
    'Other online presence':profile.otherLinks||'(not provided)',
    'Existing brand colors':profile.existingColors||'(not provided)',
    'Existing brand fonts':profile.existingFonts||'(not provided)',
    'Inspiration — loves':profile.inspoLove||'(not provided)',
    'Inspiration — avoid':profile.inspoAvoid||'(not provided)',
    'Termageddon':profile.termageddon||'(not provided)',
    'Anything else':profile.anythingElse||'(not provided)',
    '--- Content ---':'',
  };
  pages.forEach(page=>{
    page.sections.forEach(sec=>{
      sec.fields.forEach(f=>{
        if(f.type==='upnote')return;
        const k=`[${page.num} ${page.name}] ${sec.name} · ${f.label}`;
        const v=data[sec.id]?.[f.id];
        if(f.type==='rep'){const items=(v||[]).filter(Boolean);payload[k]=items.length>0?items.map((x,i)=>`${i+1}. ${x}`).join('\n'):'(not provided)';}
        else if(f.type==='cards'){const items=v||[];if(!items.length){payload[k]='(not provided)';}else{items.forEach((card,i)=>{f.subs.forEach(sub=>{payload[`${k} — ${f.lbl||'Item'} ${i+1}: ${sub.label}`]=card[sub.id]||'(not provided)';});});}}
        else if(f.type==='checks'){payload[k]=(v||[]).join(', ')||'(none selected)';}
        else{payload[k]=v||'(not provided)';}
      });
    });
  });
  return payload;
}


function useIsMobile(){
  const[mob,setMob]=useState(()=>typeof window!=='undefined'&&window.innerWidth<700);
  useEffect(()=>{
    const h=()=>setMob(window.innerWidth<700);
    window.addEventListener('resize',h);
    return()=>window.removeEventListener('resize',h);
  },[]);
  return mob;
}
function wc(t){return t?t.trim().split(/\s+/).filter(Boolean).length:0;}
function wcRange(g){const m=(g||'').match(/\d+/g);return m&&m.length>=2?[+m[0],+m[m.length-1]]:null;}

const st={
  input:{width:'100%',background:'#fff',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:'8px 11px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,color:'#27231E',outline:'none',boxSizing:'border-box'},
  xbtn:{background:'none',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,width:32,height:34,cursor:'pointer',color:'#8B7B6F',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13},
  addbtn:{background:'none',border:'1px dashed rgba(107,63,42,0.15)',borderRadius:2,padding:'6px 12px',fontFamily:"DM Mono, monospace",fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:'#8B7B6F',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5,marginTop:4},
  card:{background:'#fff',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:13,marginBottom:9},
  cardHd:{fontFamily:"DM Mono, monospace",fontSize:9.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8B7B6F',marginBottom:9,display:'flex',justifyContent:'space-between',alignItems:'center'},
  cardLabel:{fontSize:12,fontWeight:500,color:'#4D433B',marginBottom:3,display:'flex',justifyContent:'space-between'},
  hint:{fontFamily:"DM Mono, monospace",fontSize:10,color:'#8B7B6F'},
  wc:{fontFamily:"DM Mono, monospace",fontSize:10,color:'#8B7B6F',marginTop:3,display:'block'},
};

const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,350&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400&display=swap');`;
const INTAKE_CSS=`
  *{box-sizing:border-box;margin:0;padding:0;font-family:'Instrument Sans',sans-serif;}
  input,textarea,select{font-family:'Instrument Sans',sans-serif;}
  input:focus,textarea:focus,select:focus{outline:none;border-color:var(--bp-color)!important;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(107,63,42,0.2);border-radius:2px;}
  .sb-s{padding:4px 12px 4px 20px;font-size:11.5px;color:rgba(255,255,255,0.38);cursor:pointer;display:flex;align-items:center;gap:7px;border-left:2px solid transparent;transition:all 0.15s;font-family:'Instrument Sans',sans-serif;}
  .sb-s:hover{color:rgba(255,255,255,0.7);}
  .sb-s.on{color:#fff;border-left-color:var(--bp-color);background:rgba(255,255,255,0.08);}
  .sb-s.dn{color:rgba(255,255,255,0.28);}
  .addbtn:hover{border-color:var(--bp-color)!important;color:var(--bp-color)!important;}
  .ai-btn:hover{border-color:#94431C!important;color:#94431C!important;}
  .lp-btn:hover{filter:brightness(1.12);}
  .tour-next:hover{filter:brightness(1.1);}
  @keyframes tourPulse{0%{opacity:1;}50%{opacity:0.7;}100%{opacity:1;}}
  .tour-icon{animation:tourPulse 2s ease infinite;}
`;

function WC({text,guidance}){
  const c=wc(text||''),r=wcRange(guidance||'');
  if(!r)return<span style={st.wc}>{c} words</span>;
  const[mn,mx]=r;
  return<span style={{...st.wc,color:c>=mn&&c<=mx?'#5B6D4A':c>mx?'#94431C':'#8B7B6F'}}>{c} / {guidance}</span>;
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
      <div style={st.cardHd}><span>{lbl} {i+1}</span>
        {items.length>min&&<button style={{...st.xbtn,width:22,height:22,fontSize:11}} onClick={()=>onChange(items.filter((_,j)=>j!==i))}>✕</button>}
      </div>
      {subs.map(sub=><div key={sub.id} style={{marginBottom:10}}>
        <div style={st.cardLabel}><span>{sub.label}</span>{sub.guidance&&<span style={st.hint}>{sub.guidance}</span>}</div>
        {sub.multi
          ?<><textarea style={{...st.input,minHeight:68,resize:'vertical',lineHeight:1.6}} value={it[sub.id]||''} onChange={e=>upd(i,sub.id,e.target.value)} placeholder={sub.ph}/>{sub.guidance&&<WC text={it[sub.id]||''} guidance={sub.guidance}/>}</>
          :<input style={st.input} value={it[sub.id]||''} onChange={e=>upd(i,sub.id,e.target.value)} placeholder={sub.ph}/>}
      </div>)}
    </div>)}
    {items.length<max&&<button style={st.addbtn} onClick={()=>onChange([...items,mk()])}>+ Add another</button>}
  </div>;
}

function Field({f,val,onChange,driveUrl,bpColor}){
  if(f.type==='text')return<input style={st.input} value={val||''} onChange={e=>onChange(e.target.value)} placeholder={f.ph}/>;
  if(f.type==='textarea')return<><textarea style={{...st.input,minHeight:88,resize:'vertical',lineHeight:1.6}} value={val||''} onChange={e=>onChange(e.target.value)} placeholder={f.ph}/>{f.guidance&&f.guidance!=='Optional'&&<WC text={val||''} guidance={f.guidance}/>}</>;
  if(f.type==='rep')return<Repeater value={val} onChange={onChange} ph={f.ph} min={f.min||1} max={f.max||8}/>;
  if(f.type==='cards')return<Cards value={val} onChange={onChange} subs={f.subs} min={f.min||1} max={f.max||5} lbl={f.lbl||'Item'}/>;
  if(f.type==='checks')return<div>{f.options.map(o=>{const chk=(val||[]).includes(o);return<label key={o} style={{display:'flex',alignItems:'center',gap:9,marginBottom:9,fontSize:13.5,cursor:'pointer',color:'#4D433B'}}><input type="checkbox" checked={chk} style={{width:14,height:14,accentColor:bpColor||'#5B6D4A',cursor:'pointer',flexShrink:0}} onChange={()=>onChange(chk?(val||[]).filter(x=>x!==o):[...(val||[]),o])}/>{o}</label>})}</div>;
  if(f.type==='sel')return<select style={{...st.input,cursor:'pointer'}} value={val||''} onChange={e=>onChange(e.target.value)}><option value="">Select one</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
  if(f.type==='upnote')return<div style={{marginBottom:12}}>
    {driveUrl?<button onClick={()=>window.open(driveUrl,'_blank','noopener,noreferrer')} style={{background:bpColor||'#5B6D4A',color:'white',border:'none',borderRadius:2,padding:'10px 18px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>📁 Open my project folder →</button>
    :<div style={{background:'rgba(107,63,42,0.06)',border:'1px dashed rgba(107,63,42,0.2)',borderRadius:2,padding:'12px 16px',fontSize:13,color:'#8B7B6F',fontStyle:'italic'}}>No project folder linked yet — Victoria will add this before sending your intake link.</div>}
    <div style={{marginTop:8,fontSize:12,color:'#8B7B6F',fontFamily:'DM Mono, monospace',letterSpacing:'0.04em'}}>{f.guidance}</div>
  </div>;
  return null;
}

/* ─── QUOTE BLUEPRINT ──────────────────── */
const QUOTE_EMERGE=[
  {num:'01',id:'home',name:'Home',sections:[
    {id:'hero',name:'Hero',sub:'What you do + where you serve',
      why:'The first thing a visitor reads. Clarity wins over cleverness for local service businesses.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} serving ${p.area||'[area]'}${p.since?' since '+p.since:''}. My ideal customer is ${p.ideal||'[ideal customer]'}. Write 5 homepage headlines under 14 words each. Lead with service and location. Tone: ${p.tone||'direct, professional, approachable'}.`,
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'8–14 words',ph:'e.g. Professional Lawn Care for Austin and Surrounding Areas'},
        {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'One key differentiator — response time, years in business, a guarantee, or certification.'},
        {id:'cta1',label:'Primary CTA button text',type:'text',guidance:'3–5 words',ph:'e.g. Get a Free Quote'},
        {id:'cta2',label:'Secondary CTA text',type:'text',guidance:'3–5 words',ph:'e.g. See Our Services'},
        {id:'area',label:'Service area callout',type:'text',guidance:'10–20 words',ph:'e.g. Serving Austin, Round Rock, Cedar Park, and surrounding areas'},
      ]},
    {id:'trust',name:'Trust strip',sub:'Quick credibility signals',
      why:'3–4 trust markers just below the hero. Hits credibility notes before visitors scroll further.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} in ${p.area||'[area]'}. Facts: [years in business, Google rating, licenses, insurance]. Write 3–4 trust markers, 5–10 words each. Specific, no marketing language.`,
      fields:[{id:'markers',label:'Trust markers',type:'rep',guidance:'3–4 markers · 5–10 words each',ph:'e.g. Serving Austin since 2012',min:3,max:4}]},
    {id:'svc_ov',name:'Services overview',sub:'What you offer',
      why:'2–3 service cards giving visitors a quick look at your menu.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type of business]'} in ${p.area||'[area]'}. Services: [list each]. For each write a 1–2 sentence teaser confirming what is included and the result. Tone: ${p.tone||'clear, direct'}.`,
      fields:[{id:'cards',label:'Service cards',type:'cards',guidance:'2–3 services',min:2,max:3,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'e.g. Lawn Mowing',guidance:'3–6 words'},{id:'desc',label:'Description',ph:'What is included and what the result looks like.',guidance:'20–35 words',multi:true}]}]},
    {id:'why_us',name:'Why choose us',sub:'Your differentiators',
      why:'Specific, verifiable differentiators. Generic answers do not work.',
      prompt:(p)=>`Write "Why choose us" for ${p.biz||'my business'}, a ${p.type||'[type]'} in ${p.area||'[area]'}. What sets us apart: ${p.differentiator||'[differentiator]'}. Write 3–4 statements, 10–20 words each. Specific and verifiable.`,
      fields:[{id:'diffs',label:'Differentiators',type:'rep',guidance:'3–4 items · 10–20 words each',ph:'e.g. Same-day quotes guaranteed — we respond within 24 hours.',min:3,max:4}]},
    {id:'photos',name:'Work samples',sub:'Photo proof',
      why:'Photos are often the single most persuasive element for local service businesses.',
      fields:[
        {id:'pnote',label:'Your project photos',type:'upnote',guidance:'4–6 photos · before/after pairs preferred · high resolution'},
        {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe the photos you uploaded.'},
      ]},
    {id:'revs',name:'Testimonials',sub:'Social proof',
      why:'Reviews mentioning a specific service, result, or location are the most credible.',
      fields:[{id:'revlist',label:'Reviews',type:'cards',guidance:'3 reviews · 40–100 words each',min:3,max:3,lbl:'Review',subs:[{id:'text',label:'Review text',ph:'Full review — prioritize ones mentioning a specific service, result, or location.',guidance:'40–100 words',multi:true},{id:'rname',label:'Reviewer first name',ph:'e.g. Mike',guidance:''},{id:'city',label:'City or neighborhood',ph:'e.g. Cedar Park',guidance:''}]}]},
    {id:'homecta',name:'Closing CTA',sub:'The final push',
      why:'Make the next step obvious and frictionless.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to get started? Your free quote takes under 2 minutes.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Get a Free Quote'},
      ]},
  ]},
  {num:'02',id:'about',name:'About',sections:[
    {id:'abouthero',name:'Hero',sub:'Community-rooted headline',
      why:'Local buyers want to hire local. Lead with your connection to the community.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} serving ${p.area||'[area]'}${p.since?' since '+p.since:''}. Write 5 About page headlines leading with local community connection. Warm, grounded, specific. Under 14 words.`,
      fields:[{id:'headline',label:'Opening headline',type:'text',guidance:'6–14 words',ph:'e.g. Proudly Serving Austin Homeowners Since 2009'}]},
    {id:'story',name:'Our story',sub:'The origin',
      why:'Local buyers connect with local stories.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}${p.owner?', owner: '+p.owner:''}. Story: [how you started, what you did before, why you care]. Differentiator: ${p.differentiator||'[differentiator]'}. Write a 150–180 word origin story. First person. Honest and warm. Tone: ${p.tone||'human, trustworthy'}.`,
      fields:[{id:'story',label:'Business origin story',type:'textarea',guidance:'120–200 words',ph:'How and why you started. What drew you to this work. What you believe about doing the job right.'}]},
    {id:'creds',name:'Credentials',sub:'Licensed, insured, certified',
      why:'Homeowners hiring a contractor need to know they are protected.',
      fields:[{id:'credlist',label:'Credentials and professional standing',type:'rep',guidance:'List each clearly',ph:'e.g. General Liability Insurance — $2M coverage',min:1,max:10}]},
    {id:'svcarea',name:'Service area',sub:'Where you work',
      why:'Critical for local SEO. Be complete.',
      fields:[{id:'area',label:'Service area',type:'textarea',guidance:'Every city, town, or zip code — or describe your radius',ph:'e.g. Austin, Round Rock, Cedar Park, Pflugerville, Georgetown, and surrounding areas within 30 miles.'}]},
    {id:'aboutcta',name:'Closing CTA',sub:'',
      why:'A visitor who has read this far trusts you enough to take the next step.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to get started? Request your free quote today.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Get a Free Quote'},
      ]},
  ]},
  {num:'03',id:'services',name:'Services',sections:[
    {id:'svchero',name:'Hero',sub:'Direct headline and intro',
      why:'Visitors land here to confirm you do the specific service they need.',
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'4–10 words',ph:'e.g. Services Built for Every Size Job'},
        {id:'intro',label:'Intro paragraph',type:'textarea',guidance:'25–45 words',ph:'Confirm you do the work. End with a nudge toward the quote form.'},
      ]},
    {id:'svclist',name:'Services list',sub:'Each service in detail',
      why:'Visitors want to know exactly what is included before submitting a quote.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} in ${p.area||'[area]'}. Services: [list them]. For each write a scope description, 40–80 words. Be specific. Tone: ${p.tone||'clear, specific'}.`,
      fields:[{id:'svcs',label:'Services',type:'cards',guidance:'2–5 services',min:2,max:5,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'e.g. Full Lawn Maintenance',guidance:'3–6 words'},{id:'scope',label:'Scope description',ph:'What is specifically included.',guidance:'40–80 words',multi:true}]}]},
    {id:'faq',name:'FAQ',sub:'Common questions answered',
      why:'FAQs handle objections before the visitor has to ask.',
      fields:[{id:'faqs',label:'FAQ items',type:'cards',guidance:'3–6 questions',min:3,max:6,lbl:'Question',subs:[{id:'q',label:'Question',ph:'e.g. Do you provide free estimates?',guidance:''},{id:'a',label:'Answer',ph:'Direct, specific answer.',guidance:'30–80 words',multi:true}]}]},
    {id:'svccta',name:'Closing CTA',sub:'',
      why:'Make the next step obvious.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Got a project in mind? Get a free quote.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Get a Free Quote'},
      ]},
  ]},
  {num:'04',id:'getquote',name:'Get a Quote',sections:[
    {id:'quotehero',name:'Hero',sub:'Low-friction headline',
      why:'Address the hesitation: "this is going to be complicated."',
      fields:[{id:'headline',label:'Headline',type:'text',guidance:'6–12 words',ph:'e.g. Get your free quote in under 2 minutes.'}]},
    {id:'process',name:'What happens next',sub:'3-step process preview',
      why:'Removes "then what?" anxiety.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}. Process after quote request: [do you call or email? How quickly? Come out for assessment?]. Write a 3-step process, Step 1 is filling out the form.`,
      fields:[{id:'steps',label:'Process steps',type:'cards',guidance:'Exactly 3 steps · 15–25 words each',min:3,max:3,lbl:'Step',subs:[{id:'title',label:'Step title',ph:'e.g. Fill out the form',guidance:'3–6 words'},{id:'desc',label:'Description',ph:'Your actual process and timeline.',guidance:'15–25 words',multi:true}]}]},
    {id:'formfields',name:'Quote form fields',sub:'What do you need?',
      why:'5–7 fields is the sweet spot.',
      fields:[
        {id:'checks',label:'Fields to include',type:'checks',options:['Service needed (dropdown)','Property address or zip code','Scope details','Preferred timeline','Name','Phone number','Email address','Anything else? (optional)']},
        {id:'dropdown',label:'Service dropdown options',type:'rep',guidance:'List each option',ph:'e.g. Lawn Mowing',min:1,max:10},
        {id:'pref',label:'Preferred response method',type:'sel',options:['Phone','Email','Either — up to the client']},
      ]},
    {id:'trustnote',name:'Trust reinforcement',sub:'Below the form',
      why:'A small reassurance just before Submit can be the difference.',
      fields:[{id:'note',label:'Reassurance note',type:'textarea',guidance:'15–30 words',ph:'e.g. We respond within 24 hours. Your quote is free and comes with no obligation.'}]},
    {id:'after_submit',name:'What happens after submission?',sub:'Your actual follow-up process',
      why:'Not every business uses a scheduler or booking tool. Tell Victoria how you actually follow up with people who reach out — she will build the conversion experience around your real process, not an assumption.',
      fields:[
        {id:'flow',label:'What happens after someone submits?',type:'sel',options:[
          'I reach out by email to schedule a call',
          'I call them directly by phone',
          'I set up a video call — I send my own link',
          'They book directly via my scheduling tool (see above)',
          'I review their info and follow up based on what they need — no standard format',
          'Other — I will describe below',
        ]},
        {id:'flow_detail',label:'Describe your follow-up process',type:'textarea',guidance:'30–80 words',
          ph:'e.g. I review every submission personally and reach out within 48 hours by email to set up a conversation. I don\'t use a booking tool — I send a few time options and we go from there.'},
        {id:'timeline',label:'How quickly do you typically follow up?',type:'text',guidance:'',
          ph:'e.g. Within 24 hours · Within 2 business days · Same day if submitted before noon'},
      ]},
    {id:'custom_qs',name:'Custom form questions',sub:'Questions unique to your business',
      why:'Beyond the standard fields, what specific information do you need from visitors before you can have a productive first conversation? Every business is different — this is where you make the form yours.',
      fields:[
        {id:'standard',label:'Standard fields to include',type:'checks',options:[
          'First and last name',
          'Email address',
          'Phone number',
          'Preferred contact method (phone or email)',
          'Best time to reach you',
          'How did you find me?',
          'Are you currently working with anyone else on this? (yes/no)',
        ]},
        {id:'unique',label:'Custom questions specific to your business',type:'cards',guidance:'1–5 questions · only what you genuinely need',min:1,max:5,lbl:'Question',subs:[
          {id:'q',label:'Question',ph:'e.g. What type of help are you looking for?',guidance:''},
          {id:'qtype',label:'Field type',ph:'e.g. Short text · Long text · Multiple choice · Yes/No · Dropdown',guidance:''},
          {id:'opts',label:'Answer options (if multiple choice or dropdown)',ph:'e.g. Financial assistance · Housing support · Job training · Leave blank for text fields',guidance:''},
        ]},
      ]},
  ]},
  {num:'05',id:'contact',name:'Contact',sections:[
    {id:'conthero',name:'Headline and statement',sub:'',
      why:'Phone-first secondary touchpoint for local service buyers.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. Let\'s Talk About Your Project'},
        {id:'statement',label:'Brief statement',type:'textarea',guidance:'20–40 words',ph:'Warm and direct. Nudge visitors toward the quote form.'},
      ]},
    {id:'phone',name:'Phone and hours',sub:'',
      why:'Many local buyers will call before they fill out a form.',
      fields:[
        {id:'ph',label:'Business phone number',type:'text',guidance:'',ph:'e.g. (512) 555-0123'},
        {id:'hours',label:'Business hours',type:'textarea',guidance:'',ph:'Monday – Friday: 8am – 6pm\nSaturday: 9am – 3pm\nSunday: Closed'},
      ]},
    {id:'contarea',name:'Service area',sub:'',
      why:'Confirms you serve their area.',
      fields:[{id:'area',label:'Service area (contact page)',type:'textarea',guidance:'Can match About page',ph:'Same as About page or condensed.'}]},
    {id:'social',name:'Social and business links',sub:'',
      why:'Makes it easy to find you on other platforms.',
      fields:[
        {id:'google',label:'Google Business Profile URL',type:'text',guidance:'',ph:'https://g.page/...'},
        {id:'links',label:'Social media links',type:'cards',guidance:'Active platforms only',min:1,max:5,lbl:'Platform',subs:[{id:'platform',label:'Platform',ph:'e.g. Instagram',guidance:''},{id:'url',label:'URL',ph:'https://instagram.com/...',guidance:''}]},
      ]},
  ]},
];

const QUOTE_ELEVATE=[
  ...QUOTE_EMERGE.map(p=>{
    if(p.id==='home')return{...p,sections:[...p.sections,
      {id:'gall_e',name:'Work gallery [Elevate]',sub:'Expanded photo proof',tag:'elevate',
        why:'Elevate adds a dedicated gallery section — 6–8 of your best completed job photos.',
        fields:[
          {id:'pnote',label:'Gallery photos',type:'upnote',guidance:'6–8 photos · mix of job types · high resolution'},
          {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe what you uploaded.'},
        ]},
      {id:'revs_e',name:'Expanded testimonials [Elevate]',sub:'4–5 reviews',tag:'elevate',
        why:'Elevate homepage features 4–5 reviews.',
        fields:[{id:'extra',label:'1–2 additional reviews',type:'cards',guidance:'Add to your 3 Emerge reviews',min:1,max:2,lbl:'Review',subs:[{id:'text',label:'Review text',ph:'',guidance:'40–100 words',multi:true},{id:'rname',label:'Name',ph:'',guidance:''},{id:'city',label:'City',ph:'',guidance:''}]}]},
    ]};
    if(p.id==='about')return{...p,sections:[...p.sections,
      {id:'team',name:'Meet the team [Elevate]',sub:'Optional for solo operators',tag:'elevate',
        why:'If you have a crew, a team section humanizes your business.',
        fields:[
          {id:'hasteam',label:'Do you have a team to feature?',type:'sel',options:['Yes — include team members','No — solo operator or prefer to skip']},
          {id:'members',label:'Team members',type:'cards',guidance:'1–5 people',min:1,max:5,lbl:'Team member',subs:[{id:'name',label:'Name',ph:'',guidance:''},{id:'role',label:'Role',ph:'e.g. Lead Technician',guidance:''},{id:'bio',label:'Brief bio (optional)',ph:'1–2 sentences.',guidance:'20–40 words',multi:true}]},
        ]},
    ]};
    return p;
  }),
  {num:'06',id:'svcindex',name:'Services index [Elevate]',tag:'elevate',sections:[
    {id:'idx_hero',name:'Hero',sub:'',fields:[
      {id:'headline',label:'Headline',type:'text',guidance:'8–16 words',ph:'e.g. Every Service We Offer — Find the Right Fit'},
      {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'Brief overview of your range of services.'},
    ]},
    {id:'idx_cards',name:'Services grid',sub:'Cards linking to individual pages',
      why:'Give just enough detail to help visitors choose which individual service page to explore.',
      fields:[{id:'cards',label:'Service cards',type:'cards',guidance:'One card per service',min:2,max:6,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'',guidance:''},{id:'teaser',label:'1–2 sentence teaser',ph:'Who it is for and what result it produces.',guidance:'20–35 words',multi:true}]}]},
    {id:'idx_faq',name:'General FAQ',sub:'',fields:[{id:'faqs',label:'FAQ items',type:'cards',guidance:'3–5 questions',min:3,max:5,lbl:'Question',subs:[{id:'q',label:'Question',ph:'',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'30–60 words',multi:true}]}]},
    {id:'idx_cta',name:'Closing CTA',sub:'',fields:[
      {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Not sure which service you need? Get a free quote.'},
      {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Get a Free Quote'},
    ]},
  ]},
  {num:'07',id:'indivsvcs',name:'Individual service pages × 3 [Elevate]',tag:'elevate',sections:[
    {id:'isvc_names',name:'Services for individual pages',sub:'Your top 3 services',
      why:'Each of your top 3 services gets its own dedicated page. List which 3 here.',
      fields:[{id:'names',label:'Top 3 service names',type:'rep',guidance:'Exactly 3',ph:'e.g. Lawn Mowing',min:3,max:3}]},
    {id:'isvc1',name:'Service 1 — full detail',sub:'',fields:[
      {id:'name',label:'Service name',type:'text',guidance:'',ph:''},
      {id:'headline',label:'Page headline',type:'text',guidance:'8–16 words',ph:''},
      {id:'whofor',label:'Who it is for',type:'textarea',guidance:'40–80 words',ph:'Specific description of the right client.'},
      {id:'scope',label:'What is included',type:'textarea',guidance:'50–100 words',ph:'Everything covered. Be specific.'},
      {id:'faq',label:'Service-specific FAQ',type:'cards',guidance:'2–4 questions',min:2,max:4,lbl:'Question',subs:[{id:'q',label:'Question',ph:'',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'20–60 words',multi:true}]},
      {id:'cta',label:'Page CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to get started? Get a free quote today.'},
    ]},
    {id:'isvc2',name:'Service 2 — full detail',sub:'Same structure as Service 1',fields:[
      {id:'name',label:'Service name',type:'text',guidance:'',ph:''},
      {id:'headline',label:'Page headline',type:'text',guidance:'8–16 words',ph:''},
      {id:'whofor',label:'Who it is for',type:'textarea',guidance:'40–80 words',ph:''},
      {id:'scope',label:'What is included',type:'textarea',guidance:'50–100 words',ph:''},
      {id:'cta',label:'CTA headline',type:'text',guidance:'6–12 words',ph:''},
    ]},
    {id:'isvc3',name:'Service 3 — full detail',sub:'Same structure as Service 1',fields:[
      {id:'name',label:'Service name',type:'text',guidance:'',ph:''},
      {id:'headline',label:'Page headline',type:'text',guidance:'8–16 words',ph:''},
      {id:'whofor',label:'Who it is for',type:'textarea',guidance:'40–80 words',ph:''},
      {id:'scope',label:'What is included',type:'textarea',guidance:'50–100 words',ph:''},
      {id:'cta',label:'CTA headline',type:'text',guidance:'6–12 words',ph:''},
    ]},
  ]},
  {num:'08',id:'reviews',name:'Reviews page [Elevate]',tag:'elevate',sections:[
    {id:'revpage',name:'Reviews page',sub:'Dedicated social proof',
      why:'Consolidates all social proof in one place — powerful for hesitant buyers.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. What Our Clients Say'},
        {id:'googlebiz',label:'Google Business Profile URL',type:'text',guidance:'',ph:'https://g.page/...'},
        {id:'reviews',label:'Featured reviews',type:'cards',guidance:'8–12 reviews · varied services and locations',min:8,max:12,lbl:'Review',subs:[{id:'text',label:'Review text',ph:'',guidance:'30–150 words',multi:true},{id:'rname',label:'Name',ph:'',guidance:''},{id:'city',label:'City',ph:'',guidance:''}]},
        {id:'pnote',label:'Gallery photos for this page',type:'upnote',guidance:'8–12+ completed job photos'},
      ]},
  ]},
];

/* ─── CONSULTATION BLUEPRINT ──────────────────────────────── */
const CONSULTATION_EMERGE=[
  {num:'01',id:'home',name:'Home',sections:[
    {id:'hero',name:'Hero',sub:'Who you help and what changes',
      why:'The single most-read line on your site. It needs to land the outcome your ideal client is hoping for — not a list of what you do.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} who helps ${p.ideal||'[ideal client]'} achieve ${p.differentiator||'[result or shift]'}. Write 5 homepage headlines, each specific enough the right person immediately feels seen. Under 14 words. No phrases like "unlock your potential" or "transform your life." Tone: ${p.tone||'warm, direct, confident'}.`,
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'8–14 words',ph:'e.g. Clarity, momentum, and a business that finally works the way you do'},
        {id:'sub',label:'Subheadline',type:'textarea',guidance:'25–45 words',ph:'Name your ideal client, the main challenge they face, and broadly how you help.'},
        {id:'cta',label:'CTA button text',type:'text',guidance:'3–6 words',ph:'e.g. Schedule a Free Consultation'},
        {id:'proof',label:'Social proof line',type:'text',guidance:'10–20 words',ph:'e.g. Trusted by 200+ founders and small business owners.'},
      ]},
    {id:'trust',name:'Trust strip',sub:'Quick credibility signals',
      why:'3 credibility markers just below the hero — creates immediate authority.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. My credentials: [years in practice, number of clients, certifications, notable results]. Write 3 trust markers, 5–10 words each. Scannable, factual.`,
      fields:[{id:'markers',label:'Trust markers',type:'rep',guidance:'3 markers · 5–10 words each',ph:'e.g. 200+ clients served across 14 industries',min:3,max:3}]},
    {id:'probsol',name:'Problem and solution',sub:'The gap you fill',
      why:'Naming their problem accurately is the fastest way to build trust before asking for anything.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} who works with ${p.ideal||'[ideal client]'}. Problem they come with: [describe]. Shift I help them make: [describe the after state]. Write a 40–60 word problem/solution section. Acknowledge the problem, then name the path forward. Tone: ${p.tone||'empathetic, direct, hopeful'}.`,
      fields:[
        {id:'problem',label:'The problem — what they are dealing with',type:'textarea',guidance:'25–45 words',ph:'Describe their situation before working with you. The more specific, the more they will feel seen.'},
        {id:'solution',label:'The shift — what becomes possible',type:'textarea',guidance:'25–45 words',ph:'The outcome, the change, the after state.'},
      ]},
    {id:'svc_ov',name:'Services overview',sub:'What you offer',
      why:'2–3 service cards that create a clear picture of the different ways you help people.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. Services: [list each]. For each write a 1–2 sentence teaser: who it is for and what it helps them achieve. Tone: ${p.tone||'warm, direct'}.`,
      fields:[{id:'cards',label:'Service cards',type:'cards',guidance:'2–3 services',min:2,max:3,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'e.g. 1:1 Business Coaching',guidance:'3–8 words'},{id:'desc',label:'Description',ph:'Who it is for and what it helps them achieve.',guidance:'20–40 words',multi:true}]}]},
    {id:'process',name:'Process',sub:'How it works — 3 steps',
      why:'Removes the "how does this work?" uncertainty that stops people from booking.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. My process from first contact to working together: [describe]. Write a 3-step "How it works." Step title (3–5 words) and description (20–30 words) each.`,
      fields:[{id:'steps',label:'How it works steps',type:'cards',guidance:'Exactly 3 steps',min:3,max:3,lbl:'Step',subs:[{id:'title',label:'Step title',ph:'e.g. Start with a free discovery call',guidance:'3–6 words'},{id:'desc',label:'Description',ph:'What happens in this step.',guidance:'20–30 words',multi:true}]}]},
    {id:'proof',name:'Social proof',sub:'Testimonials',
      why:'Testimonials that speak to transformation and results are far more powerful than generic praise.',
      fields:[{id:'revlist',label:'Testimonials',type:'cards',guidance:'1–2 testimonials · 40–80 words each',min:1,max:2,lbl:'Testimonial',subs:[{id:'text',label:'Testimonial text',ph:'Choose ones that speak to results or transformation — not just "she was great."',guidance:'40–80 words',multi:true},{id:'name',label:'Client name and descriptor',ph:'e.g. Sarah M., E-commerce Founder',guidance:''}]}]},
    {id:'homecta',name:'Closing CTA',sub:'',
      why:'They have read your page. Make the next step obvious.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–14 words',ph:'e.g. Ready to find some clarity? Start with a free 20-minute call.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Schedule a Free Call'},
      ]},
  ]},
  {num:'02',id:'about',name:'About',sections:[
    {id:'abouthero',name:'Hero',sub:'Personal headline',
      why:'The About page is where people decide if they trust you enough to work with you.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a ${p.type||'[profession]'} at ${p.biz||'[business]'} in ${p.area||'[location]'}. Write 5 About page headlines leading with who I am and who I serve. Under 14 words. Personal, warm. No phrases like "passionate about helping people."`,
      fields:[{id:'headline',label:'Opening headline',type:'text',guidance:'6–14 words',ph:'e.g. I help overwhelmed founders find the strategy that actually moves the needle.'}]},
    {id:'whoiworkwith',name:'Who I work with',sub:'Your ideal client',
      why:'Naming your ideal client specifically tells the right person they belong here.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} who works best with ${p.ideal||'[ideal client]'}. Write a 40–60 word "Who I work with" section. Specific enough that the right person recognizes themselves immediately. Tone: ${p.tone||'direct, warm, honest'}.`,
      fields:[{id:'whofor',label:'Who I work with',type:'textarea',guidance:'40–70 words',ph:'Name the person, their situation, what they are dealing with, what they are ready for. The more accurate, the more qualified your inquiries will be.'}]},
    {id:'story',name:'My story',sub:'The origin',
      why:'People hire people they connect with. Your story is a credential.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a ${p.type||'[profession]'} at ${p.biz||'[business]'}. My background: [how I got into this, what I did before, what changed personally, why I care]. Write a 180–220 word personal story. First person, honest, specific — not a career summary. Tone: ${p.tone||'warm, direct, human'}.`,
      fields:[{id:'story',label:'Your story',type:'textarea',guidance:'150–250 words',ph:'What led you to this work? What did you do before? What changed for you personally? Why do you care? Write naturally — this should sound like you.'}]},
    {id:'funfacts',name:'Fun facts or personal details',sub:'The human side',
      why:'3–5 personal details that make you feel like a real person, not a resume.',
      fields:[{id:'facts',label:'Fun facts',type:'rep',guidance:'3–5 facts · 1 sentence each',ph:'e.g. I have lived in 4 countries and built businesses in 3 of them.',min:3,max:5}]},
    {id:'aboutcta',name:'Closing CTA',sub:'',
      why:'A visitor who has read your full About page is ready.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–14 words',ph:'e.g. If this sounds like what you have been looking for, let\'s talk.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Schedule a Free Call'},
      ]},
  ]},
  {num:'03',id:'services',name:'Services',sections:[
    {id:'svchero',name:'Hero',sub:'Transformation-forward headline',
      why:'Visitors come here to understand what you offer and whether it is right for them.',
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'6–14 words',ph:'e.g. Ways We Can Work Together'},
        {id:'sub',label:'Intro paragraph',type:'textarea',guidance:'25–50 words',ph:'Brief overview of your approach and an invitation to explore. End with your CTA.'},
      ]},
    {id:'svclist',name:'Services',sub:'Each service in detail',
      why:'Enough detail that visitors can self-select the right service without needing to call.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. Services: [list each]. For each: name (3–8 words), who it is for (20–30 words), what is included (30–50 words), transformation or outcome (20–30 words). Tone: ${p.tone||'warm, specific'}.`,
      fields:[{id:'svcs',label:'Services',type:'cards',guidance:'2–5 services',min:2,max:5,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'e.g. 1:1 Business Coaching',guidance:'3–8 words'},{id:'whofor',label:'Who it is for',ph:'Specific description of the right client.',guidance:'20–35 words',multi:true},{id:'whats',label:'What is included',ph:'What they get and what the engagement looks like.',guidance:'30–60 words',multi:true}]}]},
    {id:'faq',name:'FAQ',sub:'',
      why:'FAQs about process, timeline, and how you work reduce friction before the first call.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. Questions I get most often before booking: [list 4–6]. Write conversational FAQ answers, 2–4 sentences each. Honest, specific. Tone: ${p.tone||'warm, helpful'}.`,
      fields:[{id:'faqs',label:'FAQ items',type:'cards',guidance:'3–6 questions',min:3,max:6,lbl:'Question',subs:[{id:'q',label:'Question',ph:'e.g. How long does a coaching engagement typically last?',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'30–80 words',multi:true}]}]},
    {id:'svccta',name:'Closing CTA',sub:'',
      why:'Visitors who have read through your services are ready to act.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–14 words',ph:'e.g. Ready to find the right fit? Start with a free discovery call.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Book a Free Call'},
      ]},
  ]},
  {num:'04',id:'bookcall',name:'Book a Call',sections:[
    {id:'bookhero',name:'Hero',sub:'Low-friction headline',
      why:'Sets the expectation before the scheduler appears. Biggest hesitation: "this will be a sales call."',
      fields:[{id:'headline',label:'Headline',type:'text',guidance:'6–14 words',ph:'e.g. Let\'s spend 20 minutes figuring out if we\'re a good fit.'}]},
    {id:'whattoexpect',name:'What to expect',sub:'3-step process',
      why:'Telling visitors what happens in and after the call dramatically increases show rates.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. What happens on and after a discovery call with me: [how long, what do we talk about, what happens after, when do they hear back]. Write a 3-step "What to expect."`,
      fields:[{id:'steps',label:'What to expect',type:'cards',guidance:'Exactly 3 steps',min:3,max:3,lbl:'Step',subs:[{id:'title',label:'Step title',ph:'e.g. Tell me about where you are',guidance:'3–6 words'},{id:'desc',label:'Description',ph:'What happens in this step.',guidance:'15–25 words',multi:true}]}]},
    {id:'scheduler',name:'Scheduling tool (if applicable)',sub:'Optional — only complete if you use a booking tool',
      why:'If you use a scheduling tool like Calendly or Acuity, Victoria will embed it here. If you follow up with clients yourself via email or phone, skip this section and describe your process in the next section.',
      fields:[
        {id:'uses_tool',label:'Do you use an online scheduling tool?',type:'sel',options:['Yes — I use a scheduling tool','No — I follow up with clients myself']},
        {id:'tool',label:'Scheduling tool name (if yes)',type:'sel',options:['Calendly','Acuity Scheduling','HoneyBook','Dubsado','Square Appointments','Other','N/A — I do not use a scheduling tool']},
        {id:'link',label:'Booking link URL (if yes)',type:'text',guidance:'',ph:'e.g. https://calendly.com/yourbusiness/discovery-call'},
        {id:'calltype',label:'Call type name (if yes)',type:'text',guidance:'',ph:'e.g. Free Discovery Call'},
        {id:'duration',label:'Duration (if yes)',type:'text',guidance:'',ph:'e.g. 20 minutes'},
      ]},
    {id:'booktrust',name:'Reassurance note',sub:'Below the form or scheduler',
      why:'A short note below your conversion action reduces hesitation right before the client commits.',
      fields:[{id:'note',label:'Reassurance note',type:'textarea',guidance:'15–30 words',ph:'e.g. This is a genuine conversation — not a sales pitch. If we\'re not a fit, I\'ll tell you.'}]},
    {id:'after_submit',name:'What happens after submission?',sub:'Your actual follow-up process',
      why:'Not every business uses a scheduler or booking tool. Tell Victoria how you actually follow up with people who reach out — she will build the conversion experience around your real process, not an assumption.',
      fields:[
        {id:'flow',label:'What happens after someone submits?',type:'sel',options:[
          'I reach out by email to schedule a call',
          'I call them directly by phone',
          'I set up a video call — I send my own link',
          'They book directly via my scheduling tool (see above)',
          'I review their info and follow up based on what they need — no standard format',
          'Other — I will describe below',
        ]},
        {id:'flow_detail',label:'Describe your follow-up process',type:'textarea',guidance:'30–80 words',
          ph:'e.g. I review every submission personally and reach out within 48 hours by email to set up a conversation. I don\'t use a booking tool — I send a few time options and we go from there.'},
        {id:'timeline',label:'How quickly do you typically follow up?',type:'text',guidance:'',
          ph:'e.g. Within 24 hours · Within 2 business days · Same day if submitted before noon'},
      ]},
    {id:'custom_qs',name:'Custom form questions',sub:'Questions unique to your business',
      why:'Beyond the standard fields, what specific information do you need from visitors before you can have a productive first conversation? Every business is different — this is where you make the form yours.',
      fields:[
        {id:'standard',label:'Standard fields to include',type:'checks',options:[
          'First and last name',
          'Email address',
          'Phone number',
          'Preferred contact method (phone or email)',
          'Best time to reach you',
          'How did you find me?',
          'Are you currently working with anyone else on this? (yes/no)',
        ]},
        {id:'unique',label:'Custom questions specific to your business',type:'cards',guidance:'1–5 questions · only what you genuinely need',min:1,max:5,lbl:'Question',subs:[
          {id:'q',label:'Question',ph:'e.g. What type of help are you looking for?',guidance:''},
          {id:'qtype',label:'Field type',ph:'e.g. Short text · Long text · Multiple choice · Yes/No · Dropdown',guidance:''},
          {id:'opts',label:'Answer options (if multiple choice or dropdown)',ph:'e.g. Financial assistance · Housing support · Job training · Leave blank for text fields',guidance:''},
        ]},
      ]},
  ]},
  {num:'05',id:'contact',name:'Contact',sections:[
    {id:'conthero',name:'Headline and statement',sub:'',
      why:'Secondary touchpoint for visitors with quick questions.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. Have a Question? Let\'s Connect.'},
        {id:'statement',label:'Brief statement',type:'textarea',guidance:'20–40 words',ph:'Warm and direct. Nudge visitors toward booking a call for deeper questions.'},
      ]},
    {id:'contactform',name:'Contact form fields',sub:'',
      why:'3–4 fields only — this is a casual touchpoint.',
      fields:[{id:'fields',label:'Include these fields',type:'checks',options:['First and last name','Email address','What brings you here? (short text)','How did you find me? (optional)','Phone number (optional)']}]},
    {id:'social',name:'Social and contact links',sub:'',
      why:'Secondary way to reach you or stay connected.',
      fields:[
        {id:'email',label:'Business email address',type:'text',guidance:'',ph:'e.g. hello@yourbusiness.com'},
        {id:'links',label:'Social media links',type:'cards',guidance:'Active platforms only',min:1,max:5,lbl:'Platform',subs:[{id:'platform',label:'Platform',ph:'e.g. LinkedIn',guidance:''},{id:'url',label:'URL',ph:'https://...',guidance:''}]},
      ]},
  ]},
];

const CONSULTATION_ELEVATE=[
  ...CONSULTATION_EMERGE.map(p=>{
    if(p.id==='home')return{...p,sections:[...p.sections,
      {id:'blog_teaser',name:'Featured blog post [Elevate]',sub:'Thought leadership teaser',tag:'elevate',
        why:'Positions you as a thought leader and builds SEO passively. At least 1 published article needed before launch.',
        fields:[{id:'blog_note',label:'First article topic and draft',type:'textarea',guidance:'Provide your first article or a detailed outline — Victoria will pull it in automatically from your Blog page.',ph:'Describe the article topic and key takeaways, or paste a draft here.'}]},
    ]};
    if(p.id==='about')return{...p,sections:[...p.sections,
      {id:'creds_e',name:'Credentials and features [Elevate]',sub:'Certifications, press, speaking',tag:'elevate',
        why:'Elevates authority beyond personal story — especially important for regulated fields like therapy or financial advising.',
        fields:[
          {id:'creds',label:'Credentials, certifications, and recognitions',type:'rep',guidance:'One per line',ph:'e.g. ICF-Certified Professional Coach (PCC)',min:1,max:15},
          {id:'logos',label:'Publication or association logos',type:'textarea',guidance:'Optional',ph:'List any publications or associations whose logos you can provide for a logo strip.'},
        ]},
    ]};
    return p;
  }),
  {num:'06',id:'svcindex',name:'Services index [Elevate]',tag:'elevate',sections:[
    {id:'idx_hero',name:'Hero',sub:'Sales-forward',fields:[
      {id:'headline',label:'Headline',type:'text',guidance:'8–16 words',ph:'e.g. Find the Service That Gets You Where You\'re Trying to Go'},
      {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'Brief overview of your offerings. End with a CTA.'},
    ]},
    {id:'idx_cards',name:'Services grid',sub:'Cards linking to individual pages',
      why:'Just enough detail to help visitors choose which individual page to explore.',
      fields:[{id:'cards',label:'Service cards',type:'cards',guidance:'One card per service',min:2,max:6,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'',guidance:''},{id:'teaser',label:'1–2 sentence teaser',ph:'Who it is for and what it helps them achieve.',guidance:'20–35 words',multi:true}]}]},
    {id:'idx_faq',name:'General FAQ',sub:'Questions across all services',fields:[{id:'faqs',label:'FAQ items',type:'cards',guidance:'3–5 general questions',min:3,max:5,lbl:'Question',subs:[{id:'q',label:'Question',ph:'e.g. How do I know which service is right for me?',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'30–60 words',multi:true}]}]},
    {id:'idx_cta',name:'Closing CTA',sub:'',fields:[
      {id:'headline',label:'CTA headline',type:'text',guidance:'6–14 words',ph:'e.g. Still not sure where to start? Let\'s talk — that\'s what the discovery call is for.'},
      {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Book a Free Call'},
    ]},
  ]},
  {num:'07',id:'indivsvcs',name:'Individual service pages × 3 [Elevate]',tag:'elevate',sections:[
    {id:'isvc_names',name:'Services for individual pages',sub:'Your top 3',
      why:'Each of your top 3 services gets its own dedicated page.',
      fields:[{id:'names',label:'Top 3 service names',type:'rep',guidance:'Exactly 3',ph:'e.g. 1:1 Business Coaching',min:3,max:3}]},
    {id:'isvc1',name:'Service 1 — full detail',sub:'',fields:[
      {id:'name',label:'Service name',type:'text',guidance:'',ph:''},
      {id:'headline',label:'Page headline',type:'text',guidance:'8–16 words',ph:'e.g. The coaching program built for founders ready to grow on purpose'},
      {id:'whofor',label:'Who this is for',type:'textarea',guidance:'40–80 words',ph:'Specific description of the right client — the more specific, the better.'},
      {id:'whats',label:'What is included',type:'textarea',guidance:'50–100 words',ph:'Sessions, deliverables, access, timeline.'},
      {id:'howworks',label:'How it works',type:'cards',guidance:'3–4 steps',min:3,max:4,lbl:'Step',subs:[{id:'title',label:'Step title',ph:'e.g. Discovery call',guidance:'3–5 words'},{id:'desc',label:'Description',ph:'',guidance:'15–30 words',multi:true}]},
      {id:'faq',label:'FAQ',type:'cards',guidance:'2–4 service-specific questions',min:2,max:4,lbl:'Question',subs:[{id:'q',label:'Question',ph:'',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'20–60 words',multi:true}]},
      {id:'cta',label:'CTA headline',type:'text',guidance:'6–14 words',ph:''},
    ]},
    {id:'isvc2',name:'Service 2 — full detail',sub:'Same structure',fields:[
      {id:'name',label:'Service name',type:'text',ph:''},{id:'headline',label:'Headline',type:'text',guidance:'8–16 words',ph:''},
      {id:'whofor',label:'Who this is for',type:'textarea',guidance:'40–80 words',ph:''},{id:'whats',label:'What is included',type:'textarea',guidance:'50–100 words',ph:''},
      {id:'cta',label:'CTA headline',type:'text',guidance:'6–14 words',ph:''},
    ]},
    {id:'isvc3',name:'Service 3 — full detail',sub:'Same structure',fields:[
      {id:'name',label:'Service name',type:'text',ph:''},{id:'headline',label:'Headline',type:'text',guidance:'8–16 words',ph:''},
      {id:'whofor',label:'Who this is for',type:'textarea',guidance:'40–80 words',ph:''},{id:'whats',label:'What is included',type:'textarea',guidance:'50–100 words',ph:''},
      {id:'cta',label:'CTA headline',type:'text',guidance:'6–14 words',ph:''},
    ]},
  ]},
  {num:'08',id:'blog',name:'Blog [Elevate]',tag:'elevate',sections:[
    {id:'blogpage',name:'Blog page',sub:'Thought leadership and SEO',
      why:'Builds SEO value passively and signals expertise to visitors not yet ready to book. Aim for 3 articles at launch.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'1–3 words',ph:'e.g. Insights · Resources · The Journal'},
        {id:'article1',label:'First article (ready for launch)',type:'textarea',guidance:'600–800 words recommended',ph:'Write your first post here, or paste a draft. Recommended: headline, 3–4 subheadings, 600–800 words, ends with a soft CTA to book a call.'},
      ]},
  ]},
];

/* ─── BOOKING BLUEPRINT ──────────────────────────────────── */
const BOOKING_EMERGE=[
  {num:'01',id:'home',name:'Home',sections:[
    {id:'hero',name:'Hero',sub:'Book now — make it the obvious first step',
      why:'For appointment-based businesses, the homepage hero should make booking feel fast, easy, and worth it.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} in ${p.area||'[area]'}${p.since?' since '+p.since:''}. My ideal client: ${p.ideal||'[ideal client]'}. Write 5 homepage headlines under 14 words. Lead with the service and experience, not a tagline. Tone: ${p.tone||'warm, professional, inviting'}.`,
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'6–14 words',ph:'e.g. Austin\'s favorite lash studio — now booking for June'},
        {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'One thing that makes your experience stand out — atmosphere, technique, results, or guarantee.'},
        {id:'cta',label:'Primary CTA button text',type:'text',guidance:'3–5 words',ph:'e.g. Book an Appointment'},
        {id:'proof',label:'Social proof line',type:'text',guidance:'10–20 words',ph:'e.g. 500+ happy clients · 4.9 stars on Google'},
      ]},
    {id:'trust',name:'Trust strip',sub:'Quick credibility signals',
      why:'3 trust markers that signal experience, quality, and reliability.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'}. My facts: [years in business, certifications, client count]. Write 3 trust markers, 5–10 words each. Specific.`,
      fields:[{id:'markers',label:'Trust markers',type:'rep',guidance:'3 markers · 5–10 words each',ph:'e.g. Certified lash artist · 5 years experience',min:3,max:3}]},
    {id:'svc_prev',name:'Services preview',sub:'What you offer — with booking CTA per card',
      why:'Each service card should have its own book button — do not make clients hunt for it.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} in ${p.area||'[area]'}. Services: [list each with price and duration]. For each write a 1–2 sentence teaser: service, who it is for, what makes it worth booking. Tone: ${p.tone||'warm, clear, inviting'}.`,
      fields:[{id:'cards',label:'Service cards',type:'cards',guidance:'3–5 services',min:3,max:5,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'e.g. Classic Full Set',guidance:''},{id:'desc',label:'Description',ph:'Who it\'s for and what makes it worth booking.',guidance:'20–35 words',multi:true},{id:'duration',label:'Duration',ph:'e.g. 90 min',guidance:''},{id:'price',label:'Starting price',ph:'e.g. Starting at $120',guidance:''}]}]},
    {id:'gallery_prev',name:'Gallery teaser',sub:'Photo proof of your work',
      why:'For booking businesses, seeing the work is often what tips the decision.',
      fields:[
        {id:'pnote',label:'Gallery photos',type:'upnote',guidance:'4–6 portfolio photos · your absolute best work'},
        {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe what you uploaded.'},
      ]},
    {id:'revs',name:'Testimonials',sub:'Social proof',
      why:'Reviews mentioning specific services and results build the most trust.',
      fields:[{id:'revlist',label:'Testimonials',type:'cards',guidance:'2–3 reviews · 30–80 words each',min:2,max:3,lbl:'Review',subs:[{id:'text',label:'Review text',ph:'Prioritize reviews that mention a specific service and result.',guidance:'30–80 words',multi:true},{id:'name',label:'Client name',ph:'e.g. Ashley T.',guidance:''}]}]},
    {id:'homecta',name:'Closing CTA',sub:'',
      why:'One final, clear invitation to book.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to treat yourself? Your appointment is one click away.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Book Now'},
      ]},
  ]},
  {num:'02',id:'about',name:'About',sections:[
    {id:'abouthero',name:'Hero',sub:'Personal and welcoming',
      why:'The About page is where clients decide if they like you enough to sit in your chair.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}${p.owner?', my name is '+p.owner:''}. Write 5 About page headlines. Warm, personal, specific. Goal: make someone feel like they already know me before they book. Tone: ${p.tone||'friendly, genuine, professional'}.`,
      fields:[{id:'headline',label:'Opening headline',type:'text',guidance:'6–14 words',ph:'e.g. Hi — I\'m Ashley. I\'ve been doing this for 7 years and I still love every appointment.'}]},
    {id:'story',name:'Your story',sub:'The origin',
      why:'Clients want to know who they are trusting with their time and appearance.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}${p.owner?', and I am '+p.owner:''}. My background: [how I got into this, what I did before, what I love about the work, what I believe about my craft]. Write a 150–200 word personal story. First person, warm, specific. Tone: ${p.tone||'friendly, genuine'}.`,
      fields:[{id:'story',label:'Your story',type:'textarea',guidance:'120–200 words',ph:'How did you get into this field? What do you love about it? What do you believe about your craft and your clients?'}]},
    {id:'creds',name:'Credentials and training',sub:'Your qualifications',
      why:'Clients want to know you are trained, licensed, and experienced.',
      fields:[{id:'credlist',label:'Credentials, certifications, and training',type:'rep',guidance:'List each clearly',ph:'e.g. Licensed Esthetician — Texas State Board of Cosmetology',min:1,max:10}]},
    {id:'funfacts',name:'Personality and fun facts',sub:'The human side',
      why:'3–4 personal details that make you someone worth spending time with.',
      fields:[{id:'facts',label:'Fun facts or personal details',type:'rep',guidance:'3–5 items · 1 sentence each',ph:'e.g. I\'ve been obsessed with skincare since I was 15.',min:3,max:5}]},
    {id:'aboutcta',name:'Closing CTA',sub:'',
      why:'End with a clear invitation to book.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to book your first appointment? I\'d love to see you.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Book an Appointment'},
      ]},
  ]},
  {num:'03',id:'svcbook',name:'Services and Book',sections:[
    {id:'svchero',name:'Hero',sub:'Browse and book',
      why:'Visitors come here ready to choose a service and book. Be clear and direct.',
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'4–10 words',ph:'e.g. Browse services and book online'},
        {id:'sub',label:'Brief intro',type:'textarea',guidance:'15–30 words',ph:'Short and welcoming. Can include booking policy (no deposit required, instant confirmation, etc.).'},
      ]},
    {id:'svcdetail',name:'Services with booking',sub:'Full service menu with prices and booking CTAs',
      why:'Give enough detail that clients know exactly what they are booking.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'}. Services: [list all with details]. For each: who it is for, what happens during the service, what the result looks like. 40–60 words each.`,
      fields:[{id:'svcs',label:'Services',type:'cards',guidance:'All services — full detail',min:3,max:12,lbl:'Service',subs:[{id:'name',label:'Service name',ph:'e.g. Signature Facial',guidance:''},{id:'desc',label:'Description',ph:'Who it\'s for, what happens, and what the result looks like.',guidance:'40–70 words',multi:true},{id:'duration',label:'Duration',ph:'e.g. 60 minutes',guidance:''},{id:'price',label:'Price',ph:'e.g. $85 or Starting at $85',guidance:''}]}]},
    {id:'policies',name:'Policies',sub:'Cancellation, deposits, late arrival',
      why:'Booking businesses need clear policies — protects you and sets professional expectations.',
      fields:[{id:'policytext',label:'Policies',type:'textarea',guidance:'Professional but warm',ph:'e.g. Cancellation: Please give at least 24 hours notice. Late arrivals: If you are more than 15 minutes late, your appointment may need to be shortened or rescheduled.'}]},
    {id:'scheduler',name:'Booking tool',sub:'Your scheduling link',
      why:'Victoria will embed your scheduler directly on this page.',
      fields:[
        {id:'tool',label:'Booking tool name',type:'sel',options:['Vagaro','Square Appointments','Acuity Scheduling','Booksy','Calendly','GlossGenius','StyleSeat','Other']},
        {id:'link',label:'Booking link URL',type:'text',guidance:'',ph:'e.g. https://booksy.com/en-us/...'},
      ]},
    {id:'svcfaq',name:'FAQ',sub:'Common pre-booking questions',
      why:'Answer the questions that keep people from booking.',
      fields:[{id:'faqs',label:'FAQ items',type:'cards',guidance:'3–5 questions',min:3,max:5,lbl:'Question',subs:[{id:'q',label:'Question',ph:'e.g. Do I need to prepare anything before my appointment?',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'20–60 words',multi:true}]}]},
    {id:'after_submit',name:'What happens after submission?',sub:'Your actual follow-up process',
      why:'Not every business uses a scheduler or booking tool. Tell Victoria how you actually follow up with people who reach out — she will build the conversion experience around your real process.',
      fields:[
        {id:'flow',label:'What happens after someone submits?',type:'sel',options:[
          'I reach out by email to schedule a call',
          'I call them directly by phone',
          'I set up a video call — I send my own link',
          'They book directly via my scheduling tool (see above)',
          'I review their info and follow up based on what they need — no standard format',
          'Other — I will describe below',
        ]},
        {id:'flow_detail',label:'Describe your follow-up process',type:'textarea',guidance:'30–80 words',
          ph:'e.g. I review every submission personally and reach out within 48 hours by email to set up a conversation. I don\'t use a booking tool — I send a few time options and we go from there.'},
        {id:'timeline',label:'How quickly do you typically follow up?',type:'text',guidance:'',
          ph:'e.g. Within 24 hours · Within 2 business days · Same day if submitted before noon'},
      ]},
    {id:'custom_qs',name:'Custom form questions',sub:'Questions unique to your business',
      why:'Beyond the standard fields, what specific information do you need from visitors before you can have a productive first conversation? Every business is different — this is where you make the form yours.',
      fields:[
        {id:'standard',label:'Standard fields to include',type:'checks',options:[
          'First and last name',
          'Email address',
          'Phone number',
          'Preferred contact method (phone or email)',
          'Best time to reach you',
          'How did you find me?',
          'Are you currently working with anyone else on this? (yes/no)',
        ]},
        {id:'unique',label:'Custom questions specific to your business',type:'cards',guidance:'1–5 questions · only what you genuinely need',min:1,max:5,lbl:'Question',subs:[
          {id:'q',label:'Question',ph:'e.g. What type of help are you looking for?',guidance:''},
          {id:'qtype',label:'Field type',ph:'e.g. Short text · Long text · Multiple choice · Yes/No · Dropdown',guidance:''},
          {id:'opts',label:'Answer options (if multiple choice or dropdown)',ph:'e.g. Option A · Option B · Leave blank for text fields',guidance:''},
        ]},
      ]},
  ]},
  {num:'04',id:'gallery',name:'Gallery',sections:[
    {id:'gallhero',name:'Page header',sub:'Minimal — the photos do the talking',
      why:'Keep this page simple. The images are the content.',
      fields:[{id:'headline',label:'Page headline',type:'text',guidance:'2–5 words',ph:'e.g. The Work · Portfolio · Our Work'}]},
    {id:'gallphotos',name:'Gallery photos',sub:'Your portfolio',
      why:'For booking businesses, the gallery is where the decision happens.',
      fields:[
        {id:'pnote',label:'Portfolio photos',type:'upnote',guidance:'20–40+ photos · consistent editing · varied service types'},
        {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe what you uploaded, any organization preferences, or photos to highlight.'},
      ]},
  ]},
  {num:'05',id:'contact',name:'Contact',sections:[
    {id:'conthero',name:'Headline and statement',sub:'',
      why:'Secondary touchpoint for quick questions. Direct clients to your booking page for appointments.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. Have a Question? Say Hello.'},
        {id:'statement',label:'Brief statement',type:'textarea',guidance:'15–30 words',ph:'Short and warm. Include: "The fastest way to book is online" to keep booking traffic on the booking page.'},
      ]},
    {id:'contactform',name:'Contact form',sub:'',
      why:'Keep this short — 3–4 fields. This is for quick questions only.',
      fields:[{id:'fields',label:'Include these fields',type:'checks',options:['Name','Email address','Message / question','Phone number (optional)']}]},
    {id:'social',name:'Social and contact links',sub:'',
      why:'Instagram especially — booking businesses often have strong visual communities there.',
      fields:[
        {id:'email',label:'Business email address',type:'text',guidance:'',ph:'e.g. hello@yourstudio.com'},
        {id:'links',label:'Social media links',type:'cards',guidance:'Active platforms only',min:1,max:5,lbl:'Platform',subs:[{id:'platform',label:'Platform',ph:'e.g. Instagram',guidance:''},{id:'url',label:'URL',ph:'',guidance:''}]},
      ]},
  ]},
];

const BOOKING_ELEVATE=[
  ...BOOKING_EMERGE.map(p=>{
    if(p.id==='home')return{...p,sections:[...p.sections,
      {id:'gall_e',name:'Gallery teaser — expanded [Elevate]',sub:'6 photos on homepage',tag:'elevate',
        why:'Elevate homepage features 6 gallery photos instead of 4.',
        fields:[
          {id:'pnote',label:'Additional gallery photos',type:'upnote',guidance:'6 total on homepage — provide 2 additional to the 4 from Emerge'},
          {id:'notes',label:'Which photos to use',type:'textarea',guidance:'Optional',ph:''},
        ]},
      {id:'revs_e',name:'Expanded testimonials [Elevate]',sub:'4–5 reviews',tag:'elevate',
        why:'Add 1–2 more reviews to what you provided for Emerge.',
        fields:[{id:'extra',label:'1–2 additional reviews',type:'cards',guidance:'',min:1,max:2,lbl:'Review',subs:[{id:'text',label:'Review text',ph:'',guidance:'30–80 words',multi:true},{id:'name',label:'Client name',ph:'',guidance:''}]}]},
    ]};
    return p;
  }),
  {num:'06',id:'svcindex',name:'Services index [Elevate]',tag:'elevate',sections:[
    {id:'idx_hero',name:'Hero',sub:'Browse and book',fields:[
      {id:'headline',label:'Headline',type:'text',guidance:'4–10 words',ph:'e.g. Browse All Services — Find Your Appointment'},
      {id:'sub',label:'Brief intro',type:'textarea',guidance:'15–30 words',ph:'Short, direct. CTA above the fold for visitors who already know what they want.'},
    ]},
    {id:'idx_cards',name:'Service categories grid',sub:'Visual, scannable',
      why:'Visual and scannable — booking clients make fast decisions based on imagery and price.',
      fields:[{id:'cards',label:'Service category cards',type:'cards',guidance:'One card per category',min:2,max:8,lbl:'Category',subs:[{id:'name',label:'Category name',ph:'e.g. Lash Services',guidance:''},{id:'teaser',label:'Brief description',ph:'Who these services are for.',guidance:'10–20 words',multi:true}]}]},
    {id:'idx_policies',name:'Policies — brief',sub:'',fields:[{id:'policytext',label:'Brief policies reminder',type:'textarea',guidance:'1–2 sentences',ph:'e.g. 24-hour cancellation policy · Deposits required for new clients.'}]},
    {id:'idx_cta',name:'Closing CTA',sub:'',fields:[
      {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to book? Your appointment is online — anytime.'},
      {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Book Now'},
    ]},
  ]},
  {num:'07',id:'indivsvcs',name:'Individual service pages × 3 [Elevate]',tag:'elevate',sections:[
    {id:'isvc_names',name:'Services for individual pages',sub:'Your top 3',
      fields:[{id:'names',label:'Top 3 service names',type:'rep',guidance:'Exactly 3',ph:'',min:3,max:3}]},
    {id:'isvc1',name:'Service 1 — full detail',sub:'',fields:[
      {id:'name',label:'Service name',type:'text',ph:''},{id:'headline',label:'Page headline',type:'text',guidance:'8–16 words',ph:''},
      {id:'desc',label:'Full service description',type:'textarea',guidance:'80–150 words',ph:'Who it is for, what happens, preparation instructions, what the result looks like.'},
      {id:'duration',label:'Duration',type:'text',ph:''},{id:'price',label:'Price',type:'text',ph:''},
      {id:'faq',label:'Service-specific FAQ',type:'cards',guidance:'2–4 questions',min:2,max:4,lbl:'Question',subs:[{id:'q',label:'Question',ph:'',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'20–60 words',multi:true}]},
      {id:'cta',label:'Booking CTA text',type:'text',guidance:'3–5 words',ph:'e.g. Book This Service'},
    ]},
    {id:'isvc2',name:'Service 2 — full detail',sub:'Same structure',fields:[
      {id:'name',label:'Service name',type:'text',ph:''},{id:'headline',label:'Page headline',type:'text',ph:''},
      {id:'desc',label:'Full description',type:'textarea',guidance:'80–150 words',ph:''},
      {id:'duration',label:'Duration',type:'text',ph:''},{id:'price',label:'Price',type:'text',ph:''},
      {id:'cta',label:'Booking CTA text',type:'text',ph:'e.g. Book This Service'},
    ]},
    {id:'isvc3',name:'Service 3 — full detail',sub:'Same structure',fields:[
      {id:'name',label:'Service name',type:'text',ph:''},{id:'headline',label:'Page headline',type:'text',ph:''},
      {id:'desc',label:'Full description',type:'textarea',guidance:'80–150 words',ph:''},
      {id:'duration',label:'Duration',type:'text',ph:''},{id:'price',label:'Price',type:'text',ph:''},
      {id:'cta',label:'Booking CTA text',type:'text',ph:'e.g. Book This Service'},
    ]},
  ]},
  {num:'08',id:'booknow',name:'Book Now [Elevate]',tag:'elevate',sections:[
    {id:'bookstalone',name:'Standalone booking page',sub:'Dedicated conversion page',
      why:'In Elevate, the booking experience gets its own standalone page — less distraction, higher conversion.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–10 words',ph:'e.g. Book your appointment online — it takes under 2 minutes.'},
        {id:'tool',label:'Booking tool',type:'sel',options:['Vagaro','Square Appointments','Acuity Scheduling','Booksy','Calendly','GlossGenius','StyleSeat','Other']},
        {id:'link',label:'Booking link URL',type:'text',ph:''},
        {id:'note',label:'Reassurance note',type:'textarea',guidance:'15–30 words',ph:'e.g. Instant confirmation. Cancel or reschedule anytime with 24 hours notice.'},
      ]},
  ]},
];

/* ─── INQUIRY BLUEPRINT ──────────────────────────────────── */
const INQUIRY_EMERGE=[
  {num:'01',id:'home',name:'Home',sections:[
    {id:'hero',name:'Hero',sub:'Emotional headline + hero image',
      why:'The hero IMAGE is chosen first — the headline responds to the feeling the image creates. Copy does not sell here. It creates atmosphere.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'} in ${p.area||'[area]'}. I work with ${p.ideal||'[ideal client]'}. Write 5 homepage headlines that speak to the feeling of the work — not the service itself. Under 14 words each. Emotional, specific, atmospheric. Tone: ${p.tone||'evocative, warm, elevated'}.`,
      fields:[
        {id:'heroimage',label:'Hero image choice',type:'upnote',guidance:'1 image · your single strongest portfolio piece · full-resolution · the most important content decision on your site'},
        {id:'headline',label:'Headline',type:'text',guidance:'6–14 words',ph:'e.g. The moments that matter most — captured the way you\'ll want to remember them.'},
        {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'1–2 sentences. Who you serve and what you create for them. Save origin story for About.'},
        {id:'cta',label:'CTA button text',type:'text',guidance:'3–6 words',ph:'e.g. Start Your Inquiry · Work With Me'},
      ]},
    {id:'port_prev',name:'Portfolio teaser',sub:'6–8 curated images',
      why:'After the hero, the portfolio teaser is the second emotional wave — creates the urge to see more.',
      fields:[
        {id:'pnote',label:'Portfolio teaser images',type:'upnote',guidance:'6–8 images · your most emotionally resonant work · diverse moments and light'},
        {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe what you uploaded or which images to prioritize.'},
      ]},
    {id:'about_prev',name:'About teaser',sub:'Brief intro and photo',
      why:'A short introduction on the homepage gives visitors a glimpse of the person behind the work.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a ${p.type||'[profession]'} at ${p.biz||'[business]'} based in ${p.area||'[area]'}. Write a 40–60 word homepage About teaser. Warm, personal, specific. Should make someone feel like they have met me. End with an invitation to the About page. Tone: ${p.tone||'warm, genuine, inviting'}.`,
      fields:[
        {id:'teaser',label:'About teaser text',type:'textarea',guidance:'40–70 words',ph:'Brief intro — who you are, where you are based, and what drives your work.'},
        {id:'photo',label:'Your photo',type:'upnote',guidance:'1 warm, approachable photo of you · not a formal headshot'},
      ]},
    {id:'proof',name:'Testimonials',sub:'1–2 story-driven reviews',
      why:'Testimonials that speak to the experience and emotional outcome are the most powerful.',
      fields:[{id:'revlist',label:'Testimonials',type:'cards',guidance:'1–2 reviews · 60–120 words · emotionally resonant',min:1,max:2,lbl:'Testimonial',subs:[{id:'text',label:'Testimonial text',ph:'Choose reviews that speak to the experience, the emotion, or specific value — not just "she was great." The best inquiry testimonials make the reader feel something.',guidance:'60–120 words',multi:true},{id:'name',label:'Client name and event/session type',ph:'e.g. Jamie + Marcus · Wedding, September 2024',guidance:''}]}]},
    {id:'homecta',name:'Closing CTA',sub:'Soft and inviting',
      why:'End with an open door, not a hard sell.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–16 words',ph:'e.g. If you\'ve been looking for someone who cares as much as you do — I\'d love to hear from you.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Start Your Inquiry'},
      ]},
  ]},
  {num:'02',id:'about',name:'About',sections:[
    {id:'abouthero',name:'Hero',sub:'Personal, location-specific headline',
      why:'The About page is where the client decides if they trust you with one of the most important moments of their lives.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a ${p.type||'[profession]'} based in ${p.area||'[area]'}. Write 5 About page headlines. Personal, warm, grounded in who I am and where I work. Under 14 words. Should feel like meeting someone, not reading a bio.`,
      fields:[{id:'headline',label:'Opening headline',type:'text',guidance:'6–14 words',ph:'e.g. I\'m Naomi — a Portland-based photographer who lives for the unguarded moments.'}]},
    {id:'approach',name:'Approach and philosophy',sub:'How you work and what you believe',
      why:'For creative inquiry businesses, your philosophy is part of what people are buying.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. What I believe about my work: ${p.differentiator||'[your philosophy]'}. Write a 60–90 word "My approach" section. Conveys creative point of view and what makes working with me different. Tone: ${p.tone||'warm, thoughtful, distinctive'}.`,
      fields:[{id:'approach',label:'Your approach and philosophy',type:'textarea',guidance:'60–100 words',ph:'What do you believe about your work? What do you prioritize that others do not? What is the experience of working with you like?'}]},
    {id:'story',name:'Your story',sub:'The origin — give it the length it deserves',
      why:'The Inquiry Blueprint About page has the most room for personal story of all four Blueprints. Use it.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a ${p.type||'[profession]'} in ${p.area||'[area]'}. My story: [what drew me to this work, what I did before, a turning point, what I believe, who I am outside of work]. Write a 300–380 word personal story. Raw and real — not a career summary. Read it out loud. If any sentence sounds like a LinkedIn profile, rewrite it. Tone: ${p.tone||'genuine, specific, human'}.`,
      fields:[{id:'story',label:'Your story',type:'textarea',guidance:'280–400 words · give it the full length it deserves',ph:'What drew you to this work? What did you do before? Was there a turning point? What do you believe about your craft? Who are you outside of work? Write as if you are talking to someone you already like.'}]},
    {id:'workingwme',name:'What to expect working with me',sub:'The experience',
      why:'Removes unknowns — especially important for high-stakes occasions.',
      fields:[{id:'experience',label:'The experience of working with you',type:'textarea',guidance:'60–100 words',ph:'What does a typical engagement look like from first contact through delivery? How do you communicate? What do you take off their plate?'}]},
    {id:'funfacts',name:'Fun facts and personal details',sub:'The human side',
      why:'3–5 personal details that make you someone worth trusting with a significant moment.',
      fields:[{id:'facts',label:'Fun facts',type:'rep',guidance:'3–5 items · 1 sentence each',ph:'e.g. I once photographed a wedding in a rainstorm and it produced some of my favorite images.',min:3,max:5}]},
    {id:'aboutcta',name:'Closing CTA',sub:'',
      why:'End with a warm invitation.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'8–16 words',ph:'e.g. If this feels like the right fit, I\'d love to hear about what you are planning.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Start Your Inquiry'},
      ]},
  ]},
  {num:'03',id:'portfolio',name:'Portfolio',sections:[
    {id:'porthero',name:'Page header',sub:'Minimal — let the work lead',
      why:'Any copy here competes with the images. Page headline and nothing else.',
      fields:[{id:'headline',label:'Page headline',type:'text',guidance:'2–4 words',ph:'e.g. The Work · Portfolio · The Gallery'}]},
    {id:'portgrid',name:'Portfolio grid',sub:'30–50+ images · curated and consistent',
      why:'Volume of strong, cohesive work is more compelling than a small curated selection. Consistent editing matters most.',
      fields:[
        {id:'pnote',label:'Portfolio images',type:'upnote',guidance:'30–50+ images · consistent editing throughout · emotional variety — different moments, not just different locations'},
        {id:'notes',label:'Notes for Victoria',type:'textarea',guidance:'Optional — editing style, organization notes, images to prioritize',ph:'e.g. "All images edited with my signature warm preset. Please feature the ceremony series from the Hendricks wedding prominently."'},
      ]},
    {id:'portcta',name:'Portfolio CTA',sub:'After the images',
      why:'After time immersed in your portfolio, a visitor is at an emotional peak. The CTA arrives at exactly the right moment.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'8–16 words',ph:'e.g. If this is the kind of work you\'ve been looking for, I\'d love to hear from you.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Start Your Inquiry'},
      ]},
  ]},
  {num:'04',id:'inquire',name:'Inquire',sections:[
    {id:'inquirehero',name:'Hero',sub:'Warm, personal, makes reaching out feel easy',
      why:'One job: make the act of reaching out feel like the start of something good, not a form to fill out.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a ${p.type||'[profession]'} at ${p.biz||'[business]'}. Write 3 Inquire page headline options. Warm, open, personal. Should feel like I am genuinely excited to hear from them. Under 14 words each. Tone: ${p.tone||'warm, genuine, inviting'}.`,
      fields:[{id:'headline',label:'Headline',type:'text',guidance:'6–14 words',ph:'e.g. Tell me about your day — I\'d love to hear what you\'re planning.'}]},
    {id:'inqprocess',name:'What happens next',sub:'3-step process preview',
      why:'Removes "then what?" anxiety at the highest-stakes moment on the site.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. My process after receiving an inquiry: [how quickly do you respond, what does the first conversation look like, when does contract/booking happen]. Write a 3-step process. Step 1 is submitting the inquiry.`,
      fields:[{id:'steps',label:'Process steps',type:'cards',guidance:'Exactly 3 steps',min:3,max:3,lbl:'Step',subs:[{id:'title',label:'Step title',ph:'e.g. Tell me about your event',guidance:'3–6 words'},{id:'desc',label:'Description',ph:'What happens and when.',guidance:'15–25 words',multi:true}]}]},
    {id:'inqform',name:'Inquiry form fields',sub:'What do you need to evaluate the inquiry?',
      why:'Collect enough to have a real first conversation — not so much that it becomes a barrier.',
      fields:[{id:'checks',label:'Fields to include',type:'checks',options:['First and last name','Email address','Phone number (optional)','Event type','Event date','Event location / venue','How did you find me?','Tell me about your event (open text)','What matters most to you about your photography or experience?','Budget range (optional)']}]},
    {id:'inqnote',name:'Reassurance note',sub:'Below the submit button',
      why:'A warm, human note here dramatically increases follow-through.',
      fields:[{id:'note',label:'Reassurance note',type:'textarea',guidance:'20–40 words',ph:'e.g. I read every inquiry personally and respond within 48 hours. Whether or not we\'re a fit, I\'ll always write back.'}]},
    {id:'after_submit',name:'What happens after submission?',sub:'Your actual follow-up process',
      why:'Not every business uses a scheduler or booking tool. Tell Victoria how you actually follow up with people who reach out — she will build the conversion experience around your real process.',
      fields:[
        {id:'flow',label:'What happens after someone submits?',type:'sel',options:[
          'I reach out by email to schedule a call',
          'I call them directly by phone',
          'I set up a video call — I send my own link',
          'They book directly via my scheduling tool (see above)',
          'I review their info and follow up based on what they need — no standard format',
          'Other — I will describe below',
        ]},
        {id:'flow_detail',label:'Describe your follow-up process',type:'textarea',guidance:'30–80 words',
          ph:'e.g. I review every submission personally and reach out within 48 hours by email to set up a conversation. I don\'t use a booking tool — I send a few time options and we go from there.'},
        {id:'timeline',label:'How quickly do you typically follow up?',type:'text',guidance:'',
          ph:'e.g. Within 24 hours · Within 2 business days · Same day if submitted before noon'},
      ]},
    {id:'custom_qs',name:'Custom form questions',sub:'Questions unique to your business',
      why:'Beyond the standard fields, what specific information do you need from visitors before you can have a productive first conversation? Every business is different — this is where you make the form yours.',
      fields:[
        {id:'standard',label:'Standard fields to include',type:'checks',options:[
          'First and last name',
          'Email address',
          'Phone number',
          'Preferred contact method (phone or email)',
          'Best time to reach you',
          'How did you find me?',
          'Are you currently working with anyone else on this? (yes/no)',
        ]},
        {id:'unique',label:'Custom questions specific to your business',type:'cards',guidance:'1–5 questions · only what you genuinely need',min:1,max:5,lbl:'Question',subs:[
          {id:'q',label:'Question',ph:'e.g. What type of help are you looking for?',guidance:''},
          {id:'qtype',label:'Field type',ph:'e.g. Short text · Long text · Multiple choice · Yes/No · Dropdown',guidance:''},
          {id:'opts',label:'Answer options (if multiple choice or dropdown)',ph:'e.g. Option A · Option B · Leave blank for text fields',guidance:''},
        ]},
      ]},
  ]},
  {num:'05',id:'contact',name:'Contact',sections:[
    {id:'conthero',name:'Headline and statement',sub:'',
      why:'Secondary touchpoint — most clients should go through the Inquire page.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. Have a Quick Question? Let\'s Connect.'},
        {id:'statement',label:'Brief statement',type:'textarea',guidance:'20–40 words',ph:'Short and warm. Redirect booking inquiries to the Inquire page. This form is for quick questions, vendor inquiries, or press.'},
      ]},
    {id:'social',name:'Social and contact links',sub:'',
      why:'Instagram is the primary discovery platform for most inquiry businesses.',
      fields:[
        {id:'email',label:'Business email address',type:'text',guidance:'For press and vendor inquiries',ph:'e.g. hello@yourstudio.com'},
        {id:'links',label:'Social media links',type:'cards',guidance:'Instagram is priority · Pinterest if active',min:1,max:4,lbl:'Platform',subs:[{id:'platform',label:'Platform',ph:'e.g. Instagram',guidance:''},{id:'url',label:'URL',ph:'https://instagram.com/...',guidance:''}]},
      ]},
  ]},
];

const INQUIRY_ELEVATE=[
  ...INQUIRY_EMERGE.map(p=>{
    if(p.id==='home')return{...p,sections:[...p.sections,
      {id:'revs_e',name:'Expanded testimonials [Elevate]',sub:'3–4 reviews including one about investment value',tag:'elevate',
        why:'Include at least one testimonial that speaks to the investment being worth it — primes visitors for the Investment page.',
        fields:[{id:'extra',label:'1–2 additional testimonials',type:'cards',guidance:'Include one that addresses investment value',min:1,max:2,lbl:'Testimonial',subs:[{id:'text',label:'Testimonial text',ph:'Prioritize a review like: "I know it was a stretch for our budget but I would do it again a hundred times."',guidance:'60–150 words',multi:true},{id:'name',label:'Client name and event',ph:'',guidance:''}]}]},
      {id:'press',name:'Press and features strip [Elevate]',sub:'Publication logos or credits',tag:'elevate',
        why:'For Elevate clients targeting higher-budget inquiries, being seen in recognized publications is a powerful signal.',
        fields:[
          {id:'haspres',label:'Do you have press features or publication credits?',type:'sel',options:['Yes — I have features to include','No — I will skip this section']},
          {id:'preslist',label:'Publications, styled shoots, awards, or recognitions',type:'rep',guidance:'Provide logo files in your Drive folder',ph:'e.g. Featured in Magnolia Rouge Magazine · Spring 2024',min:1,max:10},
        ]},
    ]};
    return p;
  }),
  {num:'06',id:'portindex',name:'Portfolio index [Elevate]',tag:'elevate',sections:[
    {id:'portidx',name:'Portfolio index page',sub:'3 category covers',
      why:'In Elevate, the single portfolio page becomes an index plus three category galleries.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'2–4 words',ph:'e.g. The Work'},
        {id:'intro',label:'One-liner intro',type:'text',guidance:'10–20 words',ph:'e.g. Explore by category — or start your inquiry anytime.'},
        {id:'cats',label:'Portfolio categories',type:'cards',guidance:'Exactly 3 categories',min:3,max:3,lbl:'Category',subs:[{id:'name',label:'Category name',ph:'e.g. Weddings · Portraits · Commercial',guidance:'1–2 words'},{id:'coverNote',label:'Cover image description',ph:'Which image to use as the cover for this category.',guidance:''}]},
      ]},
  ]},
  {num:'07',id:'portcats',name:'Portfolio category pages × 3 [Elevate]',tag:'elevate',sections:[
    {id:'portcat1',name:'Category 1 — gallery',sub:'Images + brief headline',fields:[
      {id:'name',label:'Category name',type:'text',ph:'e.g. Weddings'},
      {id:'headline',label:'Category page headline',type:'text',guidance:'4–12 words',ph:'e.g. Love stories, documented honestly.'},
      {id:'pnote',label:'Category images',type:'upnote',guidance:'15–30+ images · all from this category · consistent editing'},
      {id:'review',label:'Category-specific testimonial',type:'textarea',guidance:'60–120 words · from a client in this category',ph:'One review specific to this type of work.'},
    ]},
    {id:'portcat2',name:'Category 2 — gallery',sub:'Same structure',fields:[
      {id:'name',label:'Category name',type:'text',ph:''},{id:'headline',label:'Category headline',type:'text',guidance:'4–12 words',ph:''},
      {id:'pnote',label:'Category images',type:'upnote',guidance:'15–30+ images'},{id:'review',label:'Category testimonial',type:'textarea',guidance:'60–120 words',ph:''},
    ]},
    {id:'portcat3',name:'Category 3 — gallery',sub:'Same structure',fields:[
      {id:'name',label:'Category name',type:'text',ph:''},{id:'headline',label:'Category headline',type:'text',guidance:'4–12 words',ph:''},
      {id:'pnote',label:'Category images',type:'upnote',guidance:'15–30+ images'},{id:'review',label:'Category testimonial',type:'textarea',guidance:'60–120 words',ph:''},
    ]},
  ]},
  {num:'08',id:'investment',name:'Investment [Elevate — unique to Inquiry Blueprint]',tag:'elevate',sections:[
    {id:'invhero',name:'Hero',sub:'Transparent, confident, warm',
      why:'Unique to the Inquiry Blueprint. A visitor who reads this page is pre-qualifying themselves — they want to know if they can afford you.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. I want to write an Investment page. My work is priced at [your range] and clients who are the right fit understand the investment reflects experience, skill, time, and what they are trusting me to create. Write a 60–80 word opening that reframes pricing as a value conversation — not defensive, not apologetic. Tone: ${p.tone||'confident, warm, transparent'}.`,
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'6–14 words',ph:'e.g. An honest conversation about investment'},
        {id:'intro',label:'Opening copy',type:'textarea',guidance:'50–80 words',ph:'Frame the Investment page confidently. This is not where you apologize for your pricing — it is where you make the case for it.'},
      ]},
    {id:'invvalue',name:'The value of the investment',sub:'What they are really paying for',
      why:'Help clients understand what is behind the price — not just deliverables, but experience, expertise, and intangibles.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} charging [price range]. What clients often do not realize they are paying for: [list — years of training, equipment, editing time, preparation, the experience itself]. Write a 60–80 word "What you are investing in" section. Specific and honest — not defensive.`,
      fields:[{id:'value',label:'What they are investing in',type:'textarea',guidance:'60–90 words',ph:'Everything that goes into the work that clients might not see — training, equipment, editing time, process, the experience itself. Make the price feel earned.'}]},
    {id:'invpricing',name:'Package overview',sub:'Starting prices or ranges',
      why:'"Wedding collections starting at $X" tells the right client they are in the right place.',
      fields:[{id:'packages',label:'Packages or starting prices',type:'cards',guidance:'1–6 packages',min:1,max:6,lbl:'Package',subs:[{id:'name',label:'Package or collection name',ph:'e.g. Elopement Collection',guidance:''},{id:'price',label:'Starting price or range',ph:'e.g. Starting at $2,800',guidance:''},{id:'includes',label:'What is included',ph:'e.g. 4 hours, 400+ edited images, online gallery',guidance:'20–50 words',multi:true}]}]},
    {id:'invfaq',name:'Investment FAQ',sub:'Booking, payment, deposit questions',
      why:'Answering these here makes the inquiry conversation more productive.',
      prompt:(p)=>`I am a ${p.type||'[profession]'} at ${p.biz||'[business]'}. Questions about my booking process and payment: [list them]. Write conversational FAQ answers, 2–4 sentences each. Honest and specific.`,
      fields:[{id:'faqs',label:'Investment FAQ',type:'cards',guidance:'3–5 questions',min:3,max:5,lbl:'Question',subs:[{id:'q',label:'Question',ph:'e.g. Do you offer payment plans?',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'30–80 words',multi:true}]}]},
    {id:'invcta',name:'Investment page CTA',sub:'Warm closing',
      why:'A visitor who has read the entire Investment page and is still here is a pre-qualified lead.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'8–16 words',ph:'e.g. If this feels like the right investment for your day, I\'d love to hear from you.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–6 words',ph:'Start Your Inquiry'},
      ]},
  ]},
];

/* ─── SHOP BLUEPRINT ─────────────────────────────────────── */
const SHOP_EMERGE=[
  {num:'01',id:'home',name:'Home',sections:[
    {id:'hero',name:'Hero',sub:'Brand story + featured products',
      why:'The homepage hero leads with brand vibe and shows products immediately. Visitor needs to feel the brand and see what you sell in one scroll.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} based in ${p.area||'[area]'}${p.since?' founded in '+p.since:''}. I sell ${p.ideal||'[describe products]'}. Write 5 homepage headlines under 14 words that lead with brand story and make someone want to browse. Tone: ${p.tone||'warm, distinctive, inviting'}.`,
      fields:[
        {id:'headline',label:'Headline',type:'text',guidance:'6–14 words',ph:'e.g. Small-batch skincare made with ingredients you can actually pronounce'},
        {id:'sub',label:'Subheadline',type:'textarea',guidance:'20–40 words',ph:'Brand story in two sentences — who makes it, why, and what makes it different.'},
        {id:'cta',label:'Primary CTA button text',type:'text',guidance:'3–5 words',ph:'e.g. Shop Now · Browse the Collection'},
      ]},
    {id:'featprods',name:'Featured products',sub:'4–6 hero products on homepage',
      why:'Showcasing your best-selling or signature products immediately drives the highest conversion.',
      fields:[{id:'prods',label:'Products to feature on homepage',type:'cards',guidance:'4–6 products · your bestsellers or signature items',min:4,max:6,lbl:'Product',subs:[{id:'name',label:'Product name',ph:'e.g. Lavender Honey Face Serum',guidance:''},{id:'tagline',label:'One-line description',ph:'e.g. Deeply hydrating · for dry and sensitive skin',guidance:'10–20 words'},{id:'price',label:'Price',ph:'e.g. $38',guidance:''}]}]},
    {id:'brandstory',name:'Brand story teaser',sub:'Brief origin + CTA to About',
      why:'2–3 sentences that build trust and connection before the visitor reaches the About page.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} in ${p.area||'[area]'}. Brand story: [how it started, what problem it solves, who makes it, what makes it different]. Write a 60–80 word homepage brand story teaser. Warm, specific. Tone: ${p.tone||'warm, authentic'}.`,
      fields:[{id:'story',label:'Brand story teaser',type:'textarea',guidance:'50–80 words',ph:'How did the brand start? What problem does it solve? Who makes it? What makes it different?'}]},
    {id:'proof',name:'Testimonials and reviews',sub:'2–3 product reviews',
      why:'Product reviews are among the most powerful conversion tools in e-commerce.',
      fields:[{id:'revlist',label:'Product reviews',type:'cards',guidance:'2–3 reviews · 30–80 words · mention specific products if possible',min:2,max:3,lbl:'Review',subs:[{id:'text',label:'Review text',ph:'Best if it mentions a specific product and result.',guidance:'30–80 words',multi:true},{id:'name',label:'Customer name',ph:'e.g. Danielle M.',guidance:''},{id:'product',label:'Product purchased',ph:'e.g. Lavender Honey Face Serum',guidance:''}]}]},
    {id:'homecta',name:'Shop CTA',sub:'Drive to the full catalog',
      why:'End with a clear invitation to browse the full collection.',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–14 words',ph:'e.g. Ready to find your new favorite? Browse the full collection.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Shop All Products'},
      ]},
  ]},
  {num:'02',id:'storesetup',name:'Store Setup',sections:[
    {id:'basics',name:'Store basics',sub:'The essentials for your Squarespace store configuration',
      why:'These details configure how your store operates — currency, timezone, checkout, and tax are all set during the build.',
      fields:[
        {id:'tagline',label:'Store tagline or short description',type:'textarea',guidance:'1–2 sentences — used in browser tabs and search previews',ph:'e.g. Small-batch soy candles, poured by hand in Nashville.'},
        {id:'email',label:'Customer-facing contact email',type:'text',guidance:'Visible to customers',ph:'e.g. hello@yourshop.com'},
        {id:'support_email',label:'Customer support email (if different)',type:'text',guidance:'Optional',ph:'e.g. support@yourshop.com'},
        {id:'currency',label:'Currency',type:'text',guidance:'',ph:'e.g. USD'},
        {id:'timezone',label:'Store timezone',type:'text',guidance:'',ph:'e.g. Central Time (CT)'},
        {id:'checkout',label:'Checkout type',type:'sel',options:['Guest checkout (recommended — reduces friction)','Account required','Both options available']},
      ]},
    {id:'tax',name:'Sales tax',sub:'',
      why:'Squarespace can calculate tax automatically by state. You need to tell Victoria which states you have sales tax nexus in.',
      fields:[
        {id:'collect_tax',label:'Will you collect sales tax?',type:'sel',options:['Yes','No','Not sure — I need guidance']},
        {id:'tax_states',label:'If yes — which states or regions?',type:'textarea',guidance:'List all states where you have sales tax nexus',ph:'e.g. Tennessee, California, New York'},
      ]},
    {id:'social_setup',name:'Social media accounts',sub:'For store footer and connection',
      why:'List only platforms you actively post to — dormant accounts signal inattention.',
      fields:[{id:'socials',label:'Social profiles',type:'cards',guidance:'Active platforms only',min:1,max:6,lbl:'Platform',subs:[{id:'platform',label:'Platform',ph:'e.g. Instagram',guidance:''},{id:'handle',label:'Handle or URL',ph:'e.g. @yourshop or https://instagram.com/...',guidance:''}]}]},
  ]},
  {num:'03',id:'shop',name:'Shop',sections:[
    {id:'shophero',name:'Shop page header',sub:'Minimal — let products lead',
      why:'Visitors are here to browse. Keep the header brief.',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'2–5 words',ph:'e.g. The Shop · Browse All · Our Products'},
        {id:'sub',label:'One-line intro (optional)',type:'text',guidance:'10–20 words',ph:'e.g. Handmade in small batches · ships within 3–5 business days.'},
      ]},
    {id:'collections',name:'Collections',sub:'Define your collections first — products will reference these',
      why:'Collections organize your products into browsable categories. Emerge supports up to 3 collections, Elevate up to 6. Define them here before adding products.',
      fields:[{id:'cols',label:'Collections (categories)',type:'rep',guidance:'Up to 3 for Emerge · give each a clear, short name',ph:'e.g. Candles · Skincare · Gift Sets',min:1,max:3}]},
    {id:'productlist',name:'Product catalog',sub:'One entry per product — reference your collection names above',
      why:'Victoria will set up each product in Squarespace based on what you provide here. Be as complete as possible — weight and dimensions are needed for shipping calculation.',
      fields:[{id:'prods',label:'Products',type:'cards',guidance:'Up to 20 products for Emerge',min:1,max:20,lbl:'Product',subs:[
        {id:'name',label:'Product name',ph:'e.g. Cedar + Vanilla Soy Candle',guidance:''},
        {id:'collection',label:'Collection / category',ph:'Enter the collection name exactly as listed above',guidance:''},
        {id:'short_desc',label:'Short description',ph:'15–30 words — for the product card on the shop page.',guidance:'15–30 words',multi:true},
        {id:'full_desc',label:'Full description',ph:'60–100 words — for the product detail page. What it is, what it does, who it\'s for, what makes it worth buying.',guidance:'60–100 words',multi:true},
        {id:'price',label:'Price',ph:'e.g. $28.00',guidance:''},
        {id:'sku',label:'SKU (optional)',ph:'e.g. CAN-001',guidance:''},
        {id:'type',label:'Physical or digital?',ph:'Physical / Digital',guidance:''},
        {id:'fulfillment',label:'In stock or made to order?',ph:'In Stock / Made to Order',guidance:''},
        {id:'qty',label:'Stock quantity',ph:'e.g. 12 (leave blank if made to order)',guidance:''},
        {id:'weight',label:'Weight',ph:'e.g. 1.2 lbs — required for shipping calculation',guidance:''},
        {id:'dims',label:'Dimensions (L × W × H)',ph:'e.g. 4 × 4 × 5 inches — required for shipping calculation',guidance:''},
        {id:'variations',label:'Variations (size, scent, color, etc.)',ph:'e.g. Scent: Cedar / Lavender / Vanilla',guidance:'Leave blank if no variations'},
        {id:'var_prices',label:'Price per variation (if prices differ)',ph:'e.g. S: $24, M: $28, L: $32',guidance:''},
        {id:'var_stock',label:'Stock per variation',ph:'e.g. Cedar: 8, Lavender: 5',guidance:''},
        {id:'related',label:'Related products (2–3 names)',ph:'e.g. Lavender Face Serum, Rose Hip Oil',guidance:''},
        {id:'care',label:'Care instructions',ph:'e.g. Trim wick to 1/4 inch before each burn',guidance:''},
        {id:'materials',label:'Materials / ingredients',ph:'e.g. 100% soy wax, cotton wick, fragrance oil',guidance:''},
        {id:'notes',label:'Notes for Victoria',ph:'Anything special about this product\'s setup.',guidance:''},
      ]}]},
    {id:'images_note',name:'Product images',sub:'Upload to your project folder',
      why:'Minimum 1 clean product shot per item on a neutral background. Recommended: 3–5 images per product. Format: JPG or PNG, minimum 1000px on shortest side. Organize in subfolders named by product.',
      fields:[
        {id:'pnote',label:'Product photos',type:'upnote',guidance:'Organize in subfolders named by product · file names should match product name or SKU'},
        {id:'img_notes',label:'Image notes for Victoria',type:'textarea',guidance:'Optional',ph:'Describe your folder structure, any hero shots to highlight, or variation images.'},
      ]},
  ]},
  {num:'04',id:'shipping',name:'Shipping',sections:[
    {id:'shippingmethod',name:'Shipping method',sub:'',
      why:'This determines how shipping costs are calculated at checkout. Choose the method that best fits your product weights and price points.',
      fields:[
        {id:'method',label:'Shipping method',type:'sel',options:['Flat rate (same price for all orders)','Free shipping on all orders','Free over a threshold (e.g. free over $50)','Carrier-calculated (real-time rates from USPS, UPS, etc.)']},
        {id:'flat_domestic',label:'Domestic flat rate (if flat rate)',type:'text',guidance:'',ph:'e.g. $6.00'},
        {id:'flat_intl',label:'International flat rate (if flat rate)',type:'text',guidance:'',ph:'e.g. $18.00 or N/A'},
        {id:'free_threshold',label:'Free shipping threshold (if applicable)',type:'text',guidance:'',ph:'e.g. Free shipping on orders over $75'},
      ]},
    {id:'carriers',name:'Carriers and international',sub:'',
      why:'Victoria needs to know which carriers you use and whether you ship internationally to configure shipping zones correctly.',
      fields:[
        {id:'carrier',label:'Carriers you use',type:'checks',options:['USPS','UPS','FedEx','Other']},
        {id:'carrier_other',label:'Other carrier name',type:'text',guidance:'Only if Other selected above',ph:''},
        {id:'international',label:'Do you ship internationally?',type:'sel',options:['Yes — worldwide','Yes — select countries only','No — domestic only']},
        {id:'intl_countries',label:'If select countries — which ones?',type:'textarea',guidance:'',ph:'e.g. Canada, United Kingdom, Australia'},
      ]},
    {id:'processing',name:'Processing and delivery',sub:'',
      why:'Sets customer expectations before they buy — one of the biggest sources of post-purchase frustration if not clearly communicated.',
      fields:[
        {id:'proc_time',label:'Processing / handling time',type:'text',guidance:'How long from order placed to order shipped',ph:'e.g. Ships within 3–5 business days'},
        {id:'expedited',label:'Do you offer expedited or express shipping?',type:'sel',options:['Yes','No']},
        {id:'expedited_detail',label:'If yes — describe options and pricing',type:'textarea',guidance:'',ph:'e.g. Priority Mail (2–3 days): $14.00 / Express (1–2 days): $28.00'},
        {id:'local_pickup',label:'Do you offer local pickup?',type:'sel',options:['Yes','No']},
        {id:'pickup_detail',label:'If yes — pickup address or instructions',type:'textarea',guidance:'',ph:''},
        {id:'local_delivery',label:'Do you offer local delivery?',type:'sel',options:['Yes','No']},
      ]},
    {id:'packaging',name:'Packaging',sub:'',
      why:'Lets Victoria communicate your packaging experience to customers on the site and in order confirmation emails.',
      fields:[
        {id:'pkg_type',label:'Packaging type',type:'sel',options:['Standard / plain packaging','Branded packaging','Eco-friendly / sustainable packaging']},
        {id:'pkg_notes',label:'Packaging notes for customers',type:'textarea',guidance:'Optional',ph:'e.g. All orders are wrapped in tissue paper and shipped in a branded kraft box.'},
      ]},
  ]},
  {num:'05',id:'policies',name:'Store Policies',sections:[
    {id:'returns',name:'Return policy',sub:'',
      why:'A clear return policy removes one of the biggest hesitations a new customer has before buying. Answer the questions first, then use the AI prompt to draft your policy.',
      prompt:(p)=>`Write a return policy for my online shop, ${p.biz||'[business name]'}. Here are my details: I [do / do not] accept returns. If yes, customers have [X] days from delivery. Items must be [unopened and unused / in original condition / etc.]. The following are NOT returnable: [list]. To request a return, customers should [contact email / fill out a form / etc.]. Refunds are issued as [original payment / store credit]. Write this as 80–120 words of plain-language policy.`,
      fields:[
        {id:'accept_returns',label:'Do you accept returns?',type:'sel',options:['Yes','No — all sales final','It depends — I\'ll explain in notes']},
        {id:'return_window',label:'If yes — how many days from delivery?',type:'text',guidance:'',ph:'e.g. 14 days'},
        {id:'return_condition',label:'Condition required for return',type:'text',guidance:'',ph:'e.g. Unopened and unused, in original packaging'},
        {id:'non_returnable',label:'Items that are NOT returnable',type:'textarea',guidance:'',ph:'e.g. Personal care items, digital products, sale items, custom orders'},
        {id:'refund_type',label:'Refunds issued as',type:'sel',options:['Original payment method','Store credit','Exchange only','Assessed case by case']},
        {id:'return_policy_draft',label:'Your return policy (draft or final)',type:'textarea',guidance:'Use the AI prompt above to generate a draft, then edit to sound like you',ph:''},
      ]},
    {id:'fulfillment',name:'Fulfillment policy',sub:'',
      why:'Especially important if your products are made to order. Sets expectations before checkout so customers aren\'t surprised after they\'ve paid.',
      prompt:(p)=>`Write a fulfillment policy for my online shop, ${p.biz||'[business name]'}. I fulfill orders by [shipping from stock / making to order / both]. If made to order, production takes [X] business days before shipping. Order confirmations are sent automatically. Shipping confirmations with tracking are sent automatically. Order cancellations are [accepted any time before shipping / accepted within X hours / not accepted for made-to-order items]. Write this as 60–90 words of plain-language policy.`,
      fields:[
        {id:'fulfill_method',label:'How do you fulfill orders?',type:'sel',options:['Ship from existing stock — orders go out as received','Made to order — each item is made after purchase','Mix of both — some in stock, some made to order','Digital delivery — sent automatically after purchase']},
        {id:'made_to_order_time',label:'If made to order — production time before shipping',type:'text',guidance:'',ph:'e.g. 5–7 business days'},
        {id:'cancellations',label:'Order cancellations',type:'sel',options:['Accepted any time before shipping','Accepted within a limited window (specify below)','Not accepted for made-to-order items','Assessed case by case']},
        {id:'cancel_window',label:'Cancellation window (if limited)',type:'text',guidance:'',ph:'e.g. Within 24 hours of placing the order'},
        {id:'digital_delivery',label:'For digital products — how are they delivered?',type:'sel',options:['Automatic download link sent via email after purchase','Link provided on confirmation page','Delivered manually by me','N/A — I don\'t sell digital products']},
        {id:'fulfill_policy_draft',label:'Your fulfillment policy (draft or final)',type:'textarea',guidance:'Use the AI prompt above to generate a draft',ph:''},
      ]},
    {id:'privacy',name:'Privacy policy',sub:'',
      why:'Any store that collects customer information is legally required to have a privacy policy in most jurisdictions. This is not optional.',
      fields:[{id:'privacy_choice',label:'How would you like to handle your privacy policy?',type:'sel',options:['Add Termageddon to my build — handle setup for me ($49 setup + $129/year)','I already have a privacy policy — I\'ll provide the text','I\'ll write my own','Not sure — let\'s talk about it on a call']}]},
  ]},
  {num:'06',id:'about',name:'About',sections:[
    {id:'abouthero',name:'Hero',sub:'Brand founder story',
      why:'The About page builds the trust that converts browsers into buyers — especially for premium or handmade products.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'} in ${p.area||'[area]'}. Write 5 About page headlines that lead with the brand founder story. Warm, specific, human. Under 14 words each.`,
      fields:[{id:'headline',label:'Opening headline',type:'text',guidance:'6–14 words',ph:'e.g. Made by hand, with ingredients I\'d give my own family'}]},
    {id:'brandstory',name:'Full brand story',sub:'Origin, mission, values',
      why:'Product buyers want to know who made this, why, and what they stand for.',
      prompt:(p)=>`I run ${p.biz||'[business name]'}, a ${p.type||'[type]'}. Brand story: [how it started, what problem it solves, who is behind it, values, what makes it different]. Write a 200–250 word About page story. First person or "we." Honest, warm, specific. Tone: ${p.tone||'authentic, brand-specific'}.`,
      fields:[{id:'story',label:'Full brand story',type:'textarea',guidance:'180–260 words',ph:'How did this brand start? What problem were you solving? Who is behind it? What do you believe about the products you make and the people who use them?'}]},
    {id:'whymakes',name:'What makes your products different',sub:'Your differentiator',
      why:'Often in the ingredients, process, sourcing, or values.',
      fields:[{id:'diff',label:'What makes your products different',type:'textarea',guidance:'50–80 words',ph:'Ingredients, sourcing, process, values, what you never include — whatever genuinely differentiates what you make from what anyone else offers.'}]},
    {id:'aboutcta',name:'Closing CTA',sub:'',
      fields:[
        {id:'headline',label:'CTA headline',type:'text',guidance:'6–12 words',ph:'e.g. Ready to try it for yourself? Browse the collection.'},
        {id:'btn',label:'Button text',type:'text',guidance:'3–5 words',ph:'Shop Now'},
      ]},
  ]},
  {num:'07',id:'extras',name:'Extras and Add-ons',sections:[
    {id:'gifting',name:'Gift options',sub:'',
      why:'Gift messaging and wrapping can meaningfully increase average order value — especially for shops that sell giftable products.',
      fields:[
        {id:'gift_msg',label:'Do you want to offer gift messaging?',type:'sel',options:['Yes — customers can add a gift message at checkout','No']},
        {id:'gift_wrap',label:'Do you want to offer gift wrapping?',type:'sel',options:['Yes — as a free option','Yes — as a paid add-on','No']},
        {id:'gift_wrap_price',label:'If paid — gift wrapping price',type:'text',guidance:'',ph:'e.g. $4.00'},
      ]},
    {id:'discounts',name:'Discount and coupon codes',sub:'',
      why:'Launch codes and welcome discounts are a great way to drive first purchases. Victoria will set these up in Squarespace during the build.',
      fields:[{id:'codes',label:'Launch discount codes',type:'cards',guidance:'List any codes you want set up at launch',min:1,max:6,lbl:'Code',subs:[{id:'code',label:'Code',ph:'e.g. WELCOME10',guidance:''},{id:'type',label:'Discount type',ph:'e.g. 10% off all orders',guidance:''},{id:'exp',label:'Expiration (optional)',ph:'e.g. Expires Dec 31, 2025',guidance:''}]}]},
    {id:'email_mktg',name:'Email marketing',sub:'',
      why:'Collecting emails from day one is one of the highest-value things you can do for a new e-commerce store.',
      fields:[
        {id:'email_tool',label:'Email marketing platform (if any)',type:'sel',options:['Squarespace Email Campaigns','Mailchimp','Klaviyo','Flodesk','Other','Not set up yet']},
        {id:'email_other',label:'If Other — platform name',type:'text',guidance:'',ph:''},
        {id:'popup',label:'Do you want an email capture popup on the site?',type:'sel',options:['Yes — set up a popup with a discount incentive','Yes — set up a popup without a discount','No popup']},
        {id:'popup_incentive',label:'Popup incentive (if applicable)',type:'text',guidance:'',ph:'e.g. 10% off your first order'},
      ]},
    {id:'abandoned_cart',name:'Abandoned cart email [Elevate only]',sub:'',
      why:'Abandoned cart emails recover an average of 5–15% of abandoned carts. Elevate includes this setup.',
      fields:[{id:'cart_email',label:'Do you want an abandoned cart email configured? (Elevate only)',type:'sel',options:['Yes — please set this up','No — skip for now']}]},
  ]},
  {num:'08',id:'contact',name:'Contact',sections:[
    {id:'conthero',name:'Headline and statement',sub:'',
      fields:[
        {id:'headline',label:'Page headline',type:'text',guidance:'4–8 words',ph:'e.g. Questions? We\'re Happy to Help.'},
        {id:'statement',label:'Brief statement',type:'textarea',guidance:'15–30 words',ph:'e.g. For questions about your order, shipping, or products — reach out and we\'ll reply within 1–2 business days.'},
      ]},
    {id:'social',name:'Social and contact links',sub:'',
      fields:[
        {id:'email',label:'Business email address',type:'text',guidance:'',ph:'e.g. hello@yourbrand.com'},
        {id:'links',label:'Social media links',type:'cards',guidance:'Instagram, Pinterest, TikTok — whatever you are active on',min:1,max:5,lbl:'Platform',subs:[{id:'platform',label:'Platform',ph:'e.g. Instagram',guidance:''},{id:'url',label:'URL',ph:'',guidance:''}]},
      ]},
  ]},
];

const SHOP_ELEVATE=[
  ...SHOP_EMERGE.map(p=>{
    if(p.id==='shop')return{...p,sections:p.sections.map(s=>{
      if(s.id==='collections')return{...s,
        fields:[{id:'cols',label:'Collections (categories)',type:'rep',guidance:'Up to 6 for Elevate',ph:'e.g. Candles · Skincare · Gift Sets',min:1,max:6}]};
      if(s.id==='productlist')return{...s,
        fields:[{...s.fields[0],guidance:'Up to 20 products for Emerge — additional products in the Elevate section below'}]};
      return s;
    })};
    if(p.id==='about')return{...p,sections:[...p.sections,
      {id:'process',name:'Behind the product [Elevate]',sub:'How it is made',tag:'elevate',
        why:'Elevate About page goes deeper into process — the how behind the what.',
        fields:[{id:'process',label:'Your process or how products are made',type:'textarea',guidance:'80–150 words',ph:'Where materials come from, how products are made, what quality control looks like.'}]},
    ]};
    return p;
  }),
  {num:'09',id:'more_prods',name:'Additional products [Elevate]',tag:'elevate',sections:[
    {id:'extra_prods',name:'Products 21–50 [Elevate]',sub:'Same fields as your first 20 — up to 30 additional products',
      why:'Elevate supports up to 50 products total. Add your remaining products here using the same format.',
      fields:[{id:'prods',label:'Additional products',type:'cards',guidance:'Up to 30 more products',min:1,max:30,lbl:'Product',subs:[
        {id:'name',label:'Product name',ph:'',guidance:''},
        {id:'collection',label:'Collection / category',ph:'Enter the collection name exactly as listed',guidance:''},
        {id:'short_desc',label:'Short description',ph:'',guidance:'15–30 words',multi:true},
        {id:'full_desc',label:'Full description',ph:'',guidance:'60–100 words',multi:true},
        {id:'price',label:'Price',ph:'',guidance:''},
        {id:'type',label:'Physical or digital?',ph:'Physical / Digital',guidance:''},
        {id:'fulfillment',label:'In stock or made to order?',ph:'In Stock / Made to Order',guidance:''},
        {id:'qty',label:'Stock quantity',ph:'',guidance:''},
        {id:'weight',label:'Weight',ph:'e.g. 1.2 lbs',guidance:''},
        {id:'dims',label:'Dimensions (L × W × H)',ph:'e.g. 4 × 4 × 5 inches',guidance:''},
        {id:'variations',label:'Variations',ph:'',guidance:''},
        {id:'materials',label:'Materials / ingredients',ph:'',guidance:''},
      ]}]},
  ]},
  {num:'10',id:'blog_look',name:'Blog or Lookbook [Elevate]',tag:'elevate',sections:[
    {id:'choice',name:'Blog or Lookbook — choose one',sub:'',
      why:'Elevate adds one content page — Blog for SEO and brand storytelling, or Lookbook for visual product showcasing.',
      fields:[
        {id:'choice',label:'Which would you prefer?',type:'sel',options:['Blog — articles, tips, brand stories (good for SEO)','Lookbook — curated visual spreads showcasing products in use']},
        {id:'headline',label:'Page headline',type:'text',guidance:'1–3 words',ph:'e.g. The Journal · Lookbook · Stories'},
        {id:'firstcontent',label:'First article or lookbook spread',type:'textarea',guidance:'Blog: 400–600 words · Lookbook: describe the spread and provide images',ph:'Write your first piece of content, or describe what you want to feature.'},
      ]},
  ]},
  {num:'11',id:'faq_page',name:'FAQ page [Elevate]',tag:'elevate',sections:[
    {id:'faqpage',name:'Standalone FAQ page',sub:'Shipping, returns, care, and product questions',
      why:'Dedicated FAQ page reduces customer service volume and removes pre-purchase hesitation.',
      fields:[{id:'faqs',label:'All FAQ items',type:'cards',guidance:'8–15 questions covering shipping, returns, care, ingredients, and ordering',min:8,max:15,lbl:'Question',subs:[{id:'q',label:'Question',ph:'',guidance:''},{id:'a',label:'Answer',ph:'',guidance:'20–80 words',multi:true}]}]},
  ]},
];


/* ─── SPEAKER BLUEPRINT (flat-rate one-pager) ──────────────── */
const SPEAKER_BLUEPRINT=[
  {num:'01',id:'speaker',name:'The Speaker Blueprint — One Page',sections:[
    {id:'hero',name:'Hero',sub:'Your photo, name, and one-line positioning',
      why:'The first thing an event planner sees. It needs to say who you are and what you speak about — clearly enough that they know in five seconds whether to keep reading.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a speaker who talks about ${p.differentiator||'[your core topic or area of expertise]'}. My audience is typically ${p.ideal||'[type of event / audience]'}. Write 5 one-line positioning statements for a speaker website hero, under 14 words each. Should communicate who I help and what I speak about — not a job title. Tone: ${p.tone||'confident, warm, direct'}.`,
      fields:[
        {id:'photo',label:'Speaker photo or speaking shot',type:'upnote',guidance:'1 image · high-resolution · ideally you on stage or a strong portrait'},
        {id:'name',label:'Name as it should appear',type:'text',guidance:'',ph:'e.g. Dr. Sabrina Jackson'},
        {id:'tagline',label:'One-line positioning',type:'text',guidance:'6–14 words',ph:'e.g. Helping leaders turn burnout into their next breakthrough.'},
        {id:'cta',label:'Primary CTA button text',type:'text',guidance:'3–6 words',ph:'e.g. Inquire About Booking'},
      ]},
    {id:'topics',name:'Speaking topics',sub:'2–4 talks or topic areas',
      why:'This is what event planners are actually shopping for. A planner scans this section before anything else — without it, the rest of the site can\'t do its job.',
      prompt:(p)=>`I am a speaker who talks about ${p.differentiator||'[core topic]'} for audiences like ${p.ideal||'[type of audience]'}. List 2–4 signature talks or topic areas. For each, write a title (3–8 words) and a 2–3 sentence description of what the audience walks away with. Tone: ${p.tone||'confident, specific, outcome-focused'}.`,
      fields:[{id:'talks',label:'Speaking topics',type:'cards',guidance:'2–4 topics',min:2,max:4,lbl:'Topic',subs:[
        {id:'title',label:'Talk title',ph:'e.g. From Burnout to Breakthrough',guidance:'3–8 words'},
        {id:'desc',label:'Description',ph:'What this talk covers and what the audience walks away with.',guidance:'30–60 words',multi:true},
      ]}]},
    {id:'video',name:'Watch them speak',sub:'A clip of you on stage',
      why:'The single most important section on the page. Event organizers rarely book a speaker they haven\'t seen — this is what turns interest into an inquiry.',
      fields:[
        {id:'videourl',label:'Video link (YouTube or Vimeo)',type:'text',guidance:'2–5 minutes ideal',ph:'https://youtube.com/watch?v=...'},
        {id:'videonote',label:'Notes for Victoria',type:'textarea',guidance:'Optional',ph:'e.g. "Use the 3-minute clip from the 2024 keynote — that\'s my strongest one." If you don\'t have a clip yet, let Victoria know.'},
      ]},
    {id:'credentials',name:'Credentials and past venues',sub:'Where you\'ve spoken or been featured',
      why:'Scannable proof. A logo strip of recognizable names does more work in three seconds than a paragraph of bio ever could.',
      fields:[
        {id:'venues',label:'Past venues, conferences, publications, or features',type:'rep',guidance:'4–10 items',ph:'e.g. TEDx Detroit · Forbes · Essence Festival',min:3,max:10},
        {id:'logos',label:'Logo files (if you have them)',type:'upnote',guidance:'Optional · official logos for venues or publications listed above'},
      ]},
    {id:'about',name:'About',sub:'Who you are, beyond the topics',
      why:'A short, warm bio paired with a portrait. This is where a planner gets a sense of you as a person — not just a subject-matter expert.',
      prompt:(p)=>`I am ${p.owner||'[name]'}, a speaker who talks about ${p.differentiator||'[core topic]'}. Background: [your story — what led you to this work, relevant experience, what you care about]. Write two versions of my bio: a short version (40–60 words) and a long version (120–160 words). Warm, specific, third person. Tone: ${p.tone||'warm, credible, approachable'}.`,
      fields:[
        {id:'bioshort',label:'Short bio',type:'textarea',guidance:'40–60 words',ph:'A quick-read version — who you are and what you speak about.'},
        {id:'biolong',label:'Long bio',type:'textarea',guidance:'120–160 words',ph:'The fuller story — background, what led you to this work, what you care about.'},
        {id:'portrait',label:'Portrait photo',type:'upnote',guidance:'1 photo · warm and approachable · can be the same as your hero photo'},
      ]},
    {id:'books',name:'Books (if applicable)',sub:'Skip this section if you don\'t have a published book',
      why:'Speakers who are also published authors get a credibility boost from their books — but this is a discovery layer, not a store.',
      fields:[
        {id:'hasbook',label:'Are you a published author?',type:'sel',options:['Yes — include my book(s)','No — skip this section']},
        {id:'books',label:'Your book(s)',type:'cards',guidance:'Leave blank if you selected "No" above',min:0,max:4,lbl:'Book',subs:[
          {id:'title',label:'Book title',ph:'e.g. The Breakthrough Mindset',guidance:''},
          {id:'cover',label:'Cover image',ph:'Upload the cover image to your project folder',guidance:''},
          {id:'link',label:'Retailer link',ph:'e.g. https://bookshop.org/...',guidance:''},
          {id:'desc',label:'One-line description',ph:'e.g. A practical guide to turning setbacks into your next chapter.',guidance:'10–20 words'},
        ]}]},
    {id:'testimonials',name:'Testimonials',sub:'2–3 quotes from event organizers or audiences',
      why:'Voice-of-the-buyer matters most here. Planners want to know what it\'s like to work with you and what your talk did for their audience.',
      fields:[{id:'quotes',label:'Testimonials',type:'cards',guidance:'2–3 quotes',min:2,max:3,lbl:'Testimonial',subs:[
        {id:'text',label:'Quote',ph:'Choose quotes that speak to the impact of the talk or the experience of working with you — not just "great speaker!"',guidance:'30–80 words',multi:true},
        {id:'attribution',label:'Name, role, and organization',ph:'e.g. Maria Lopez, Events Director, Detroit Chamber of Commerce',guidance:''},
      ]}]},
    {id:'inquiry',name:'Inquiry form',sub:'How event planners reach you',
      why:'The form is the conversion point of the entire site. Keep it short and warm — it should feel like the start of a conversation, not paperwork.',
      fields:[
        {id:'destemail',label:'Email address for inquiry submissions',type:'text',guidance:'',ph:'e.g. hello@yourname.com'},
        {id:'intro',label:'Short intro line above the form',type:'text',guidance:'8–18 words',ph:'e.g. Tell me a little about your event and I\'ll get back to you within 2 business days.'},
        {id:'fields',label:'Fields to include on the form',type:'checks',options:['Event type','Event date','Location','Expected audience size','Topic of interest','Budget range','Message / additional details']},
      ]},
    {id:'brand',name:'Branding and footer',sub:'Colors, social links, and final details',
      why:'Your site is branded around you — colors and fonts that match your voice, plus the social links and legal essentials that round out the footer.',
      fields:[
        {id:'colornote',label:'Color preferences',type:'textarea',guidance:'Optional',ph:'e.g. "Use the colors from my book cover" or "I like warm, earthy tones." If left blank, Victoria will choose from your Design Preferences selection.'},
        {id:'social',label:'Social links for the footer',type:'rep',guidance:'Add as many as apply',ph:'e.g. instagram.com/yourname',min:1,max:6},
        {id:'privacy',label:'Privacy policy',type:'sel',options:['Use Termageddon (recommended — $149/yr billed annually)','I already have a privacy policy','I will handle it myself later']},
      ]},
  ]},
];

/* ─── Design Data ────────────────────────────────────────── */
const DESIGN_DATA = {
  quote: {
    palettes: [
      { id:'A', name:'Forest & Slate',   vibe:'Outdoorsy & earthy',          primary:'#3B5640', bg:'#F5F4F0', dark:'#1E2420', text:'#3D3D35', accent:'#8C6D3F' },
      { id:'B', name:'Navy & Stone',     vibe:'Authoritative & professional', primary:'#1E3A5F', bg:'#F4F3EF', dark:'#151E2B', text:'#363636', accent:'#C17F3B' },
      { id:'C', name:'Deep Slate',       vibe:'Clean & versatile',            primary:'#374151', bg:'#F9F8F5', dark:'#111827', text:'#4B5563', accent:'#B45309' },
    ],
    fonts: [
      { id:'A', name:'Modern & Bold',       vibe:'Confident, no-nonsense',   heading:'Syne',              body:'Inter',          eyebrow:'Space Mono',    gp:'family=Syne:wght@700&family=Inter:wght@400;500&family=Space+Mono' },
      { id:'B', name:'Strong & Direct',     vibe:'Solid, reliable, clear',   heading:'Oswald',            body:'Source Sans 3',  eyebrow:'IBM Plex Mono', gp:'family=Oswald:wght@400;600&family=Source+Sans+3:wght@400;500&family=IBM+Plex+Mono' },
      { id:'C', name:'Clean & Utilitarian', vibe:'Practical, approachable',  heading:'Barlow Condensed',  body:'Barlow',         eyebrow:'Inconsolata',   gp:'family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500&family=Inconsolata' },
    ],
  },
  consultation: {
    palettes: [
      { id:'A', name:'Dusty Sage',   vibe:'Grounded & approachable', primary:'#6B7F6E', bg:'#F7F5F0', dark:'#252B26', text:'#454540', accent:'#C4956A' },
      { id:'B', name:'Deep Teal',    vibe:'Credentialed & focused',  primary:'#2C5F6A', bg:'#F5F7F7', dark:'#1A2E33', text:'#3D4A4C', accent:'#B07D5A' },
      { id:'C', name:'Warm Taupe',   vibe:'Warm & relational',       primary:'#8C7B6B', bg:'#FAF8F5', dark:'#2C2420', text:'#4A3F38', accent:'#5B7FA6' },
    ],
    fonts: [
      { id:'A', name:'Elegant & Credentialed', vibe:'Expert, refined, trustworthy', heading:'Cormorant Garamond', body:'Nunito Sans',    eyebrow:'DM Mono',      gp:'family=Cormorant+Garamond:wght@400;600&family=Nunito+Sans:wght@400;500&family=DM+Mono' },
      { id:'B', name:'Clean & Professional',   vibe:'Clear, modern, dependable',   heading:'Libre Franklin',    body:'Mulish',         eyebrow:'Space Mono',   gp:'family=Libre+Franklin:wght@400;600&family=Mulish:wght@400;500&family=Space+Mono' },
      { id:'C', name:'Warm & Authoritative',   vibe:'Human, wise, approachable',   heading:'Lora',              body:'Source Sans 3',  eyebrow:'Courier Prime', gp:'family=Lora:wght@400;600&family=Source+Sans+3:wght@400;500&family=Courier+Prime' },
    ],
  },
  booking: {
    palettes: [
      { id:'A', name:'Blush & Champagne', vibe:'Soft & feminine',           primary:'#C4907A', bg:'#FBF8F5', dark:'#2B1F1A', text:'#4D3A33', accent:'#8B7355' },
      { id:'B', name:'Rich Plum',         vibe:'Luxurious & editorial',     primary:'#6B4C6E', bg:'#F8F5FA', dark:'#1E1220', text:'#3D2E40', accent:'#C4956A' },
      { id:'C', name:'Warm Slate',        vibe:'Clean & wellness-forward',  primary:'#4A6670', bg:'#F5F8F9', dark:'#1A2428', text:'#364248', accent:'#C49A6C' },
    ],
    fonts: [
      { id:'A', name:'Classic Beauty',    vibe:'Timeless, aspirational',     heading:'Playfair Display', body:'Lato',    eyebrow:'Jost',         gp:'family=Playfair+Display:wght@400;700&family=Lato:wght@400&family=Jost:wght@400;500' },
      { id:'B', name:'Luxury & Airy',     vibe:'High-end, refined, elegant', heading:'Cormorant',        body:'DM Sans', eyebrow:'Space Mono',   gp:'family=Cormorant:wght@400;600&family=DM+Sans:wght@400;500&family=Space+Mono' },
      { id:'C', name:'Soft & Boutique',   vibe:'Gentle, personal, inviting', heading:'Marcellus',        body:'Nunito',  eyebrow:'Courier Prime', gp:'family=Marcellus&family=Nunito:wght@400;500&family=Courier+Prime' },
    ],
  },
  inquiry: {
    palettes: [
      { id:'A', name:'Warm Neutral',   vibe:'Timeless & editorial',        primary:'#A0856A', bg:'#FAF7F3', dark:'#1E1712', text:'#4A3B30', accent:'#6B8C7A' },
      { id:'B', name:'Moody Green',    vibe:'Organic & lush',              primary:'#4A6355', bg:'#F5F7F4', dark:'#161E18', text:'#364040', accent:'#B8956A' },
      { id:'C', name:'Deep Burgundy',  vibe:'Dramatic & romantic',         primary:'#7A3B45', bg:'#FAF5F5', dark:'#1E1012', text:'#4A2B30', accent:'#C4A882' },
    ],
    fonts: [
      { id:'A', name:'Editorial & Cinematic', vibe:'Documentary, weighty, honest',    heading:'Libre Baskerville', body:'Raleway', eyebrow:'Courier Prime', gp:'family=Libre+Baskerville:wght@400;700&family=Raleway:wght@400;500&family=Courier+Prime' },
      { id:'B', name:'Romantic & Modern',     vibe:'Refined, elevated, atmospheric',  heading:'Cormorant Garamond',body:'Jost',    eyebrow:'Space Mono',    gp:'family=Cormorant+Garamond:wght@400;600&family=Jost:wght@400;500&family=Space+Mono' },
      { id:'C', name:'Moody & Artistic',      vibe:'Expressive, raw, unforgettable',  heading:'IM Fell English',   body:'Lato',    eyebrow:'DM Mono',       gp:'family=IM+Fell+English&family=Lato:wght@400&family=DM+Mono' },
    ],
  },
  shop: {
    palettes: [
      { id:'A', name:'Artisan Warm',    vibe:'Handcrafted & tactile',         primary:'#B07848', bg:'#FBF8F3', dark:'#241A10', text:'#4A3828', accent:'#6B8C6E' },
      { id:'B', name:'Clean & Modern',  vibe:'Elevated & minimalist',         primary:'#3D6B6B', bg:'#F4F8F8', dark:'#141E1E', text:'#334040', accent:'#C4956A' },
      { id:'C', name:'Bold & Playful',  vibe:'Energetic & statement-making',  primary:'#C4483C', bg:'#FFF8F5', dark:'#1E0E0C', text:'#4A2820', accent:'#F0A832' },
    ],
    fonts: [
      { id:'A', name:'Boutique & Editorial', vibe:'High-contrast, packaging-worthy', heading:'Bodoni Moda',   body:'Karla',  eyebrow:'Space Grotesk', gp:'family=Bodoni+Moda:opsz,wght@6..96,400;6..96,700&family=Karla:wght@400;500&family=Space+Grotesk:wght@400;500' },
      { id:'B', name:'Classic & Clean',      vibe:'Timeless, trustworthy, polished', heading:'Playfair Display',body:'Mulish', eyebrow:'DM Mono',      gp:'family=Playfair+Display:wght@400;700&family=Mulish:wght@400;500&family=DM+Mono' },
      { id:'C', name:'Bold & Playful',       vibe:'Fun, memorable, full of energy',  heading:'Abril Fatface', body:'Nunito', eyebrow:'Jost',          gp:'family=Abril+Fatface&family=Nunito:wght@400;500&family=Jost:wght@400;500' },
    ],
  },
  speaker: {
    palettes: [
      { id:'A', name:'Editorial Plum',  vibe:'Literary & confident',    primary:'#6B4E71', bg:'#F8F6F3', dark:'#221E26', text:'#463F47', accent:'#C97B4A' },
      { id:'B', name:'Warm Clay',       vibe:'Grounded & approachable', primary:'#8C5A3C', bg:'#FAF7F2', dark:'#2A2521', text:'#4A4038', accent:'#5C7A6E' },
      { id:'C', name:'Modern Indigo',   vibe:'Sharp & contemporary',    primary:'#3F4A6B', bg:'#F5F6F8', dark:'#1A1D2B', text:'#3A3E4D', accent:'#C9A24A' },
    ],
    fonts: [
      { id:'A', name:'Editorial & Classic', vibe:'Polished, credentialed, magazine-like', heading:'Libre Baskerville', body:'Source Sans 3', eyebrow:'Space Mono',    gp:'family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500&family=Space+Mono' },
      { id:'B', name:'Warm & Literary',     vibe:'Distinctive, a little unexpected',      heading:'Fraunces',         body:'Inter',          eyebrow:'IBM Plex Mono', gp:'family=Fraunces:opsz,wght@9..144,350&family=Inter:wght@400;500&family=IBM+Plex+Mono' },
      { id:'C', name:'Modern & Direct',     vibe:'Contemporary, TED-talk energy',         heading:'Syne',             body:'Inter',          eyebrow:'IBM Plex Mono', gp:'family=Syne:wght@700&family=Inter:wght@400;500&family=IBM+Plex+Mono' },
    ],
  },
};

/* ─── Design Step Component ──────────────────────────────── */
function DesignStep({bpKey,bpMeta,design,setDesign,onNext,onBack}){
  const isMobile=useIsMobile();
  const dd=DESIGN_DATA[bpKey]||DESIGN_DATA.quote;
  const selPal=dd.palettes.find(p=>p.id===design.paletteId)||dd.palettes[0];
  const selFont=dd.fonts.find(f=>f.id===design.fontId)||dd.fonts[0];

  useEffect(()=>{
    const id='design-fonts-'+bpKey;
    if(!document.getElementById(id)){
      const allGp=dd.fonts.map(f=>f.gp).join('&');
      const link=document.createElement('link');
      link.id=id; link.rel='stylesheet';
      link.href=`https://fonts.googleapis.com/css2?${allGp}&display=swap`;
      document.head.appendChild(link);
    }
  },[bpKey]);

  const setPal=id=>setDesign(d=>({...d,paletteId:id}));
  const setFont=id=>setDesign(d=>({...d,fontId:id}));

  // Live preview card
  const preview=<div style={{
    background:selPal.bg,border:`1px solid ${selPal.accent}33`,borderRadius:4,
    padding:'28px 32px',marginBottom:32,transition:'all 0.3s ease',
    boxShadow:`0 2px 20px ${selPal.dark}10`,
  }}>
    <div style={{fontFamily:`'${selFont.eyebrow}', monospace`,fontSize:9.5,letterSpacing:'0.14em',textTransform:'uppercase',color:selPal.accent,marginBottom:10,transition:'all 0.3s'}}>{bpMeta.name.replace(' Blueprint','')} · Live Preview</div>
    <div style={{fontFamily:`'${selFont.heading}', serif`,fontSize:26,fontWeight:700,color:selPal.dark,lineHeight:1.15,marginBottom:10,transition:'all 0.3s'}}>{
      {quote:'Professional services, delivered right.', consultation:'Clarity and momentum, starting here.',
       booking:'Book your appointment in seconds.', inquiry:'The work. The feeling. The story.',
       shop:'Handcrafted with intention.'}[bpKey]||'Your website, your way.'
    }</div>
    <div style={{fontFamily:`'${selFont.body}', sans-serif`,fontSize:13.5,color:selPal.text,lineHeight:1.7,marginBottom:18,maxWidth:400,transition:'all 0.3s'}}>
      Every detail of your site is designed around how your business actually converts visitors into clients — so it works while you focus on the work.
    </div>
    <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <button style={{background:selPal.primary,color:selPal.bg,border:'none',borderRadius:2,padding:'9px 20px',fontFamily:`'${selFont.body}', sans-serif`,fontSize:13,fontWeight:500,cursor:'default',transition:'all 0.3s'}}>{bpMeta.cta}</button>
      <div style={{display:'flex',gap:6}}>
        {[selPal.primary,selPal.bg,selPal.dark,selPal.text,selPal.accent].map((c,i)=>(
          <div key={i} style={{width:18,height:18,borderRadius:'50%',background:c,border:`1px solid ${selPal.dark}20`,transition:'background 0.3s'}}/>
        ))}
      </div>
    </div>
    <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${selPal.dark}10`,display:'flex',gap:16,flexWrap:'wrap'}}>
      <span style={{fontFamily:`'${selFont.eyebrow}', monospace`,fontSize:9,color:selPal.accent,letterSpacing:'0.1em',textTransform:'uppercase'}}>Heading: {selFont.heading}</span>
      <span style={{fontFamily:`'${selFont.eyebrow}', monospace`,fontSize:9,color:selPal.text,letterSpacing:'0.1em',textTransform:'uppercase'}}>Body: {selFont.body}</span>
      <span style={{fontFamily:`'${selFont.eyebrow}', monospace`,fontSize:9,color:selPal.text,letterSpacing:'0.1em',textTransform:'uppercase'}}>Eyebrow: {selFont.eyebrow}</span>
    </div>
  </div>;

  // Palette cards
  const paletteCards=<div style={{marginBottom:32}}>
    <div style={{fontFamily:"'DM Mono', monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Color palette</div>
    <p style={{fontSize:13,color:'#8B7B6F',marginBottom:14}}>Choose the palette that feels most like your brand — or the direction you want to grow into.</p>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12}}>
      {dd.palettes.map(pal=>{
        const isSel=design.paletteId===pal.id||((!design.paletteId)&&pal.id==='A');
        return<div key={pal.id} onClick={()=>setPal(pal.id)} style={{
          border:`2px solid ${isSel?bpMeta.color:'rgba(107,63,42,0.15)'}`,
          borderRadius:4,padding:12,cursor:'pointer',background:isSel?`${bpMeta.color}06`:'#fff',
          transition:'all 0.15s',
        }}>
          <div style={{display:'flex',gap:5,marginBottom:9}}>
            {[pal.primary,pal.bg,pal.dark,pal.text,pal.accent].map((c,i)=>(
              <div key={i} style={{flex:1,height:22,borderRadius:2,background:c,border:'1px solid rgba(0,0,0,0.06)'}}/>
            ))}
          </div>
          <div style={{fontSize:12,fontWeight:500,color:'#27231E',marginBottom:2}}>{pal.name}</div>
          <div style={{fontFamily:"'DM Mono', monospace",fontSize:9,color:'#8B7B6F',letterSpacing:'0.04em'}}>{pal.vibe}</div>
          {isSel&&<div style={{marginTop:6,fontFamily:"'DM Mono', monospace",fontSize:9,color:bpMeta.color,letterSpacing:'0.06em',textTransform:'uppercase'}}>✓ Selected</div>}
        </div>;
      })}
    </div>
  </div>;

  // Font cards
  const fontCards=<div style={{marginBottom:32}}>
    <div style={{fontFamily:"'DM Mono', monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Font pairing</div>
    <p style={{fontSize:13,color:'#8B7B6F',marginBottom:14}}>All three options are curated for {bpMeta.industry}. See how each one feels in the preview above.</p>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12}}>
      {dd.fonts.map(font=>{
        const isSel=design.fontId===font.id||((!design.fontId)&&font.id==='A');
        return<div key={font.id} onClick={()=>setFont(font.id)} style={{
          border:`2px solid ${isSel?bpMeta.color:'rgba(107,63,42,0.15)'}`,
          borderRadius:4,padding:14,cursor:'pointer',background:isSel?`${bpMeta.color}06`:'#fff',
          transition:'all 0.15s',
        }}>
          <div style={{fontFamily:`'${font.eyebrow}', monospace`,fontSize:8.5,letterSpacing:'0.1em',textTransform:'uppercase',color:'#8B7B6F',marginBottom:5}}>{font.eyebrow}</div>
          <div style={{fontFamily:`'${font.heading}', serif`,fontSize:17,fontWeight:700,color:'#27231E',lineHeight:1.2,marginBottom:5}}>{font.heading}</div>
          <div style={{fontFamily:`'${font.body}', sans-serif`,fontSize:11.5,color:'#4D433B',lineHeight:1.5,marginBottom:8}}>Body text in {font.body}. Clear and readable.</div>
          <div style={{fontSize:11,fontWeight:500,color:'#27231E',marginBottom:1}}>{font.name}</div>
          <div style={{fontFamily:"'DM Mono', monospace",fontSize:9,color:'#8B7B6F',letterSpacing:'0.03em'}}>{font.vibe}</div>
          {isSel&&<div style={{marginTop:6,fontFamily:"'DM Mono', monospace",fontSize:9,color:bpMeta.color,letterSpacing:'0.06em',textTransform:'uppercase'}}>✓ Selected</div>}
        </div>;
      })}
    </div>
  </div>;

  return<div style={{flex:1,overflowY:'auto',padding:isMobile?'18px 16px 40px':'26px 34px 40px',background:'#FBF8F1'}}>
    <div style={{fontFamily:"'DM Mono', monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Step 02 of 03</div>
    <h1 style={{fontFamily:'Fraunces, serif',fontSize:23,fontWeight:350,color:'#27231E',lineHeight:1.2,margin:'0 0 4px'}}>Design preferences</h1>
    <p style={{fontSize:13,color:'#8B7B6F',marginBottom:24,lineHeight:1.6}}>Choose a color palette and font pairing. The preview above updates live as you select. You can always change these — this just gives Victoria a strong starting point for your build.</p>
    {preview}
    {paletteCards}
    {fontCards}
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:8}}>
      <button onClick={onBack} style={{background:'none',color:'#4D433B',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,cursor:'pointer'}}>← Back</button>
      <button onClick={onNext} style={{background:bpMeta.color,color:'#fff',border:'none',borderRadius:2,padding:'10px 24px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
        Start content intake →
      </button>
    </div>
  </div>;
}


/* ─── Tour Overlay ───────────────────────────────────────── */
const TOUR_STOPS = [
  { icon:'👋', title:'Welcome to your intake!',
    text:'This walks you through every section of your site one at a time. It takes most people 45–60 minutes. Click Next for a quick orientation, or skip straight to the form.' },
  { icon:'📊', title:'Track your progress',
    text:'The bar at the top fills as you complete sections. The counter on the right shows exactly how far along you are. You\'ll see it update with every section you finish.' },
  { icon:'🗂️', title:'Navigate by section',
    text:'Every page and section of your site is listed in the left panel. Completed sections show a colored dot. You can jump to any section at any time — your answers are saved as you go.' },
  { icon:'💡', title:'Why it matters',
    text:'Each section opens with a callout explaining how that specific content affects your site\'s performance. Worth a quick read before you start writing — it gives context for what Victoria is building.' },
  { icon:'✦', title:'Stuck? Use the AI prompt',
    text:'Every writing section has an AI prompt pre-loaded with your business info. Tap "AI writing prompt," copy it, paste it into Claude or ChatGPT, and edit the result until it sounds like you.' },
  { icon:'📝', title:'Word count guide',
    text:'The word count below each text field turns green when you\'re in the target range. If it\'s grey you\'re under — if it\'s red you\'ve gone a bit over. These ranges are Victoria\'s recommendations, not hard limits.' },
  { icon:'✓', title:'You\'re all set!',
    text:'Work through the sections at your own pace. You can stop and come back — just don\'t close the tab without submitting. When you finish the last section, hit Submit and Victoria takes it from there.' },
];

function TourOverlay({bpMeta,onDone,isMobile}){
  const[step,setStep]=useState(0);
  const stop=TOUR_STOPS[step];
  const isLast=step===TOUR_STOPS.length-1;
  const showSidebarNote=step===2&&isMobile;

  // Pointer hints for desktop — which part of UI to look at
  const hints=['','top of the screen →','left panel →','colored callout below →','the button below →','below text fields →',''];
  const hint=!isMobile&&hints[step]?`Look for: ${hints[step]}`:'';

  return<div style={{
    position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:9999,
    display:'flex',alignItems:'center',justifyContent:'center',padding:20,
  }}>
    <div style={{
      background:'#FBF8F1',borderRadius:4,padding:'28px 28px 24px',
      maxWidth:400,width:'100%',boxShadow:'0 24px 80px rgba(0,0,0,0.35)',
      position:'relative',
    }}>
      {/* Step dots */}
      <div style={{display:'flex',gap:5,marginBottom:20,justifyContent:'center'}}>
        {TOUR_STOPS.map((_,i)=>(
          <div key={i} style={{width:i===step?18:6,height:6,borderRadius:3,background:i===step?bpMeta.color:i<step?`${bpMeta.color}55`:'rgba(107,63,42,0.15)',transition:'all 0.3s'}}/>
        ))}
      </div>
      {/* Icon */}
      <div className="tour-icon" style={{fontSize:32,textAlign:'center',marginBottom:12}}>{stop.icon}</div>
      {/* Title */}
      <h2 style={{fontFamily:'Fraunces, serif',fontSize:20,fontWeight:350,color:'#27231E',textAlign:'center',marginBottom:10,lineHeight:1.2}}>{stop.title}</h2>
      {/* Text */}
      <p style={{fontSize:13.5,color:'#4D433B',lineHeight:1.7,textAlign:'center',marginBottom:hint?8:20}}>{stop.text}</p>
      {/* Hint */}
      {hint&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:bpMeta.color,letterSpacing:'0.08em',textTransform:'uppercase',textAlign:'center',marginBottom:18}}>{hint}</div>}
      {/* Mobile note for sidebar step */}
      {showSidebarNote&&<div style={{background:`${bpMeta.color}0e`,borderLeft:`2px solid ${bpMeta.color}`,padding:'8px 12px',borderRadius:'0 2px 2px 0',fontSize:12,color:'#4D433B',marginBottom:14}}>On mobile, use the Back and Next buttons to move between sections — the section indicator below the header shows where you are.</div>}
      {/* Buttons */}
      <div style={{display:'flex',gap:10,justifyContent:'center'}}>
        <button onClick={onDone} style={{background:'none',border:'1px solid rgba(107,63,42,0.2)',borderRadius:2,padding:'8px 16px',fontFamily:'Instrument Sans, sans-serif',fontSize:13,color:'#8B7B6F',cursor:'pointer'}}>
          Skip tour
        </button>
        <button className="tour-next" onClick={()=>isLast?onDone():setStep(s=>s+1)} style={{background:bpMeta.color,color:'white',border:'none',borderRadius:2,padding:'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:13,fontWeight:500,cursor:'pointer',transition:'filter 0.15s'}}>
          {isLast?'Start the intake →':'Next →'}
        </button>
      </div>
      {/* Counter */}
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(107,63,42,0.3)',textAlign:'center',marginTop:14,letterSpacing:'0.06em'}}>{step+1} of {TOUR_STOPS.length}</div>
    </div>
  </div>;
}

/* ─── Link Generator ─────────────────────────────────────── */
function LinkGenerator({onBack}){
  const[drive,setDrive]=useState('');
  const[bp,setBp]=useState('quote');
  const[tier,setTier]=useState('emerge');
  const[copied,setCopied]=useState(false);
  const meta=BP_META[bp];
  const base=window.location.href.split('?')[0];
  const params=new URLSearchParams({blueprint:bp,tier});
  if(drive)params.set('drive',drive);
  const link=`${base}?${params.toString()}`;
  const copy=()=>{navigator.clipboard.writeText(link).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});};
  return<div style={{minHeight:'100vh',background:'#FBF8F1',fontFamily:'Instrument Sans, sans-serif',color:'#4D433B'}}>
    <div style={{height:50,background:'#27231E',display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
      <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'#C98D26',background:'rgba(201,141,38,0.2)',padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>Link Generator · Victoria</span>
    </div>
    <div style={{maxWidth:560,margin:'0 auto',padding:'48px 24px'}}>
      <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C98D26',marginBottom:8}}>For Victoria only</div>
      <h1 style={{fontFamily:'Fraunces, serif',fontSize:26,fontWeight:350,color:'#27231E',marginBottom:8}}>Generate a client intake link</h1>
      <p style={{fontSize:14,color:'#8B7B6F',lineHeight:1.7,marginBottom:32}}>Select the blueprint and tier, paste the client's Drive folder link, and copy the URL for their welcome email.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:6}}>Blueprint</div>
          <select style={{...st.input,cursor:'pointer'}} value={bp} onChange={e=>setBp(e.target.value)}>
            {Object.entries(BP_META).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>
        {bp!=='speaker'&&<div>
          <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:6}}>Tier</div>
          <select style={{...st.input,cursor:'pointer'}} value={tier} onChange={e=>setTier(e.target.value)}>
            <option value="emerge">Emerge — $149/mo</option>
            <option value="elevate">Elevate — $349/mo</option>
          </select>
        </div>}
        {bp==='speaker'&&<div style={{background:`${meta.color}0e`,border:`1px solid ${meta.color}33`,borderRadius:2,padding:'10px 14px',display:'flex',alignItems:'center'}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:meta.color}}>Flat Rate — $1,000</span>
        </div>}
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:6}}>Client Google Drive folder link</div>
        <input style={st.input} value={drive} onChange={e=>setDrive(e.target.value)} placeholder='Paste the shared Drive folder URL here'/>
        <div style={{fontSize:12,color:'#8B7B6F',marginTop:5}}>Set folder to "Anyone with the link can view" before sending.</div>
      </div>
      <div style={{background:'#fff',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:16,marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:meta.color,flexShrink:0}}/>
          <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'#8B7B6F'}}>{meta.name} · {meta.name==='Speaker Blueprint'?'One-Page':(tier==='elevate'?'Elevate':'Emerge')}</span>
        </div>
        <div style={{fontSize:12,color:'#27231E',wordBreak:'break-all',lineHeight:1.6,marginBottom:12}}>{link}</div>
        <button onClick={copy} style={{background:copied?'rgba(91,109,74,0.12)':'rgba(107,63,42,0.06)',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:'7px 14px',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:copied?'#5B6D4A':'#8B7B6F',cursor:'pointer',transition:'all 0.15s'}}>
          {copied?'✓ Copied!':'Copy link'}
        </button>
      </div>
      <div style={{background:'rgba(91,109,74,0.06)',borderLeft:'2px solid #5B6D4A',borderRadius:'0 2px 2px 0',padding:'12px 16px',fontSize:13,color:'#4D433B',lineHeight:1.65,marginBottom:32}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5B6D4A',marginBottom:4}}>How to use</div>
        Select the blueprint and tier from the discovery call. Paste the client's Drive folder link. Copy the URL and paste into their welcome email. The intake loads pre-configured for their build.
      </div>
      <button onClick={onBack} style={{background:'none',border:'none',padding:0,fontFamily:'Instrument Sans, sans-serif',fontSize:13,color:'#8B7B6F',cursor:'pointer'}}>← Back</button>
    </div>
  </div>;
}

/* ─── Landing Page ────────────────────────────────────────── */
function LandingPage({onStart,driveUrl,bpMeta,tier,onGenerator}){
  const isSpeaker=bpMeta.name==='Speaker Blueprint';
  const timeEstimate=isSpeaker?'25–35 minutes':'45–60 minutes';
  const checklist=isSpeaker?[
    'A high-resolution photo of you — on stage or a strong portrait',
    'A link to a video of you speaking (YouTube or Vimeo, 2–5 minutes ideal)',
    'A list of past venues, conferences, or features',
    '2–3 testimonials from event organizers or audiences',
    'Your book(s) if you have any — cover images and retailer links',
    'Social media profile links',
  ]:[
    'Your logo file (PNG or SVG with transparent background)',
    'Brand colors — hex codes if you have them',
    'Your best photos — finished work, headshots, or product images',
    '3 reviews or testimonials you can reference',
    'Your services list and what each one includes',
    'Any credentials, certifications, or professional standing',
    'Your social media profile links',
  ];
  return<div style={{minHeight:'100vh',background:'#FBF8F1',fontFamily:'Instrument Sans, sans-serif',color:'#4D433B'}}>
    <div style={{height:50,background:'#27231E',display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
      <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:bpMeta.color,background:`${bpMeta.color}22`,padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase',flexShrink:0}}>{bpMeta.name} · {bpMeta.name==='Speaker Blueprint'?'One-Page':(tier==='elevate'?'Elevate':'Emerge')}</span>
    </div>
    <div style={{maxWidth:600,margin:'0 auto',padding:'36px 18px 60px'}}>
      <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:10}}>Your website starts here</div>
      <h1 style={{fontFamily:'Fraunces, serif',fontSize:32,fontWeight:350,color:'#27231E',lineHeight:1.2,marginBottom:16}}>Let's build your site.<br/>Start with your content.</h1>
      <p style={{fontSize:15,color:'#4D433B',lineHeight:1.75,marginBottom:12}}>This intake walks you through every section of your {bpMeta.name} — one at a time, in the same order your site is built. For each section you will find clear guidance on what to write, how long it should be, and why it matters.</p>
      <p style={{fontSize:15,color:'#4D433B',lineHeight:1.75,marginBottom:32}}>When you submit, Victoria receives everything organized and ready to build from. Most clients finish in <strong>{timeEstimate}</strong>.</p>
      <div style={{background:'#fff',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:20,marginBottom:32}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Before you start — have these ready</div>
        {checklist.map((item,i)=><div key={i} style={{display:'flex',gap:12,marginBottom:10,fontSize:13.5,color:'#4D433B',lineHeight:1.5}}>
          <div style={{width:20,height:20,background:`${bpMeta.color}18`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,color:bpMeta.color,fontWeight:500,marginTop:1}}>{i+1}</div>
          {item}
        </div>)}
      </div>
      {driveUrl&&<div style={{background:`${bpMeta.color}0e`,border:`1px solid ${bpMeta.color}33`,borderRadius:2,padding:16,marginBottom:28,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:3}}>Your project folder</div>
          <div style={{fontSize:13,color:'#4D433B'}}>Upload your photos and files here as you go through the intake.</div>
        </div>
        <button onClick={()=>window.open(driveUrl,'_blank','noopener,noreferrer')} style={{background:bpMeta.color,color:'white',border:'none',borderRadius:2,padding:'8px 16px',fontFamily:'Instrument Sans, sans-serif',fontSize:13,fontWeight:500,cursor:'pointer',flexShrink:0}}>
          📁 Open folder →
        </button>
      </div>}
      <div style={{background:'#27231E',borderRadius:2,padding:'16px 20px',marginBottom:32,fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:1.7}}>
        <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,display:'block',marginBottom:4}}>AI writing prompts</span>
        Each section includes an AI writing prompt pre-loaded with your business info. If you get stuck, expand the prompt, copy it, and paste it into Claude or ChatGPT for a strong first draft — then make it yours.
      </div>
      <button className="lp-btn" onClick={onStart} style={{background:bpMeta.color,color:'white',border:'none',borderRadius:2,padding:'14px 32px',fontFamily:'Fraunces, serif',fontSize:18,fontWeight:350,cursor:'pointer',letterSpacing:'0.01em',transition:'all 0.15s',display:'inline-flex',alignItems:'center',gap:10}}>
        Start my intake →
      </button>
      <div style={{marginTop:40,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.15)'}}>
        <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8B7B6F',marginBottom:8}}>For Victoria</div>
        <button onClick={onGenerator} style={{background:'none',border:'none',padding:0,fontFamily:'Instrument Sans, sans-serif',fontSize:13,color:bpMeta.color,cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>Generate a client intake link →</button>
      </div>
    </div>
  </div>;
}

/* ─── Business Profile Step ──────────────────────────────── */
const TONE_OPTIONS=['Professional and polished','Warm and approachable','Straight-talking and no-nonsense','Friendly and conversational','Confident and straightforward'];

function ProfileStep({profile,setProfile,onNext,bpMeta}){
  const isMobile=useIsMobile();
  const upd=(k,v)=>setProfile(p=>({...p,[k]:v}));
  const pf=(label,key,ph,hint)=><div style={{marginBottom:20}}>
    <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:4}}>{label}</div>
    {hint&&<div style={{fontSize:12,color:'#8B7B6F',marginBottom:6}}>{hint}</div>}
    <input style={st.input} value={profile[key]||''} onChange={e=>upd(key,e.target.value)} placeholder={ph}/>
  </div>;
  return<div style={{flex:1,overflowY:'auto',padding:'26px 34px 40px',background:'#FBF8F1'}}>
    <div style={{fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Step 01 of 03</div>
    <h1 style={{fontFamily:'Fraunces, serif',fontSize:23,fontWeight:350,color:'#27231E',lineHeight:1.2,margin:'0 0 4px'}}>Business profile</h1>
    <p style={{fontSize:13,color:'#8B7B6F',marginBottom:20}}>Pre-fills every AI writing prompt so your drafts sound like you, not a template.</p>
    <div style={{background:`${bpMeta.color}0e`,borderLeft:`2px solid ${bpMeta.color}`,padding:'10px 14px',marginBottom:24,fontSize:13,lineHeight:1.65,color:'#4D433B'}}>
      <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,display:'block',marginBottom:4}}>How this is used</span>
      Everything here stays in this session only. It personalizes the AI prompts so generated copy reflects your actual business.
    </div>
    {pf(bpMeta.name==='Speaker Blueprint'?'Your name':'Business name','biz',bpMeta.name==='Speaker Blueprint'?'e.g. Dr. Sabrina Jackson':'e.g. Austin Greenworks · Naomi Crawford Photography',null)}
    {pf('Your name (owner)','owner','e.g. Marcus Johnson · Naomi Crawford',null)}
    {pf(bpMeta.name==='Speaker Blueprint'?'What you speak about':'Type of business','type',bpMeta.name==='Speaker Blueprint'?'e.g. leadership, creative resilience, burnout recovery':'e.g. landscaping company · wedding photographer · licensed esthetician','Be specific — this goes directly into your AI prompts.')}
    {pf(bpMeta.name==='Speaker Blueprint'?'Where you\'re based':'Primary service area or location','area',bpMeta.name==='Speaker Blueprint'?'e.g. Based in Detroit · available to travel':'e.g. Austin, TX · Portland, Oregon',bpMeta.name==='Speaker Blueprint'?'Speakers can note travel availability here.':'City and region or full coverage area.')}
    {pf('In business since (year)','since','e.g. 2014',null)}
    {pf(bpMeta.name==='Speaker Blueprint'?'Your ideal audience or event type':'Your ideal customer','ideal',bpMeta.name==='Speaker Blueprint'?'e.g. corporate leadership conferences · university audiences · women\'s retreats':'e.g. busy Austin homeowners · couples planning intimate Portland weddings',bpMeta.name==='Speaker Blueprint'?'The audience or event type you\'re the best fit for.':'The person most likely to hire you or buy from you.')}
    <div style={{marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:4}}>What sets you apart</div>
      <div style={{fontSize:12,color:'#8B7B6F',marginBottom:6}}>The one or two things that genuinely differentiate you from anyone else doing what you do.</div>
      <textarea style={{...st.input,minHeight:72,resize:'vertical',lineHeight:1.6}} value={profile.differentiator||''} onChange={e=>upd('differentiator',e.target.value)} placeholder='e.g. Same-day quotes guaranteed · or · I only take 20 weddings a year so every client gets my full attention · or · All products handmade in small batches with organic ingredients'/>
    </div>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:8}}>Tone preference</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {TONE_OPTIONS.map(t=><button key={t} onClick={()=>upd('tone',t)} style={{background:profile.tone===t?bpMeta.color:'#fff',color:profile.tone===t?'white':'#4D433B',border:`1px solid ${profile.tone===t?bpMeta.color:'rgba(107,63,42,0.15)'}`,borderRadius:2,padding:'7px 14px',fontFamily:'Instrument Sans, sans-serif',fontSize:13,cursor:'pointer',transition:'all 0.15s'}}>{t}</button>)}
      </div>
    </div>

    {/* ── Contact details ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.12)'}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Contact details</div>
      {pf('Business email address','email','e.g. hello@yourbusiness.com','This will be used for site contact forms and is not shared with anyone.')}
      {pf('Business phone number (optional)','phone','e.g. (512) 555-0123',null)}
      {pf('Business address (if brick and mortar or service area)','address','e.g. 123 Main St, Austin TX 78701 · or · Serving all of Metro Detroit',null)}
    </div>
    {/* ── Online presence ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.12)'}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Online presence</div>
      {pf('Existing website URL (if you have one)','existingUrl','e.g. https://www.yoursite.com · or · None',null)}
      {pf('Any other online presence','otherLinks','e.g. Linktree, Etsy shop, Google Business Profile — paste links separated by commas',null)}
    </div>
    {/* ── Existing brand ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.12)'}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Existing brand (if you have one)</div>
      <p style={{fontSize:12,color:'#8B7B6F',marginBottom:14,lineHeight:1.6}}>If you already have brand colors and fonts, enter them here. If you are starting fresh, leave these blank — you will choose your palette and font pairing on the next step.</p>
      {pf('Existing brand colors (hex codes)','existingColors','e.g. #2C4A3E, #F5F0E8, #C4956A · or · None yet — I\'ll choose on the next step',null)}
      {pf('Existing brand fonts (if you know them)','existingFonts','e.g. Playfair Display for headings, Lato for body · or · None yet',null)}
    </div>
    {/* ── Inspiration ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.12)'}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Design inspiration</div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:4}}>Websites you love the look or feel of</div>
        <div style={{fontSize:12,color:'#8B7B6F',marginBottom:6}}>Paste URLs if possible — can be any industry, not just yours.</div>
        <textarea style={{...st.input,minHeight:68,resize:'vertical',lineHeight:1.6}} value={profile.inspoLove||''} onChange={e=>upd('inspoLove',e.target.value)} placeholder={'e.g. https://www.tonyrobbins.com · https://www.studiodiy.com\nWhat I love about them: clean layouts, strong CTAs, confident copy'}/>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:4}}>Styles or vibes to avoid</div>
        <div style={{fontSize:12,color:'#8B7B6F',marginBottom:6}}>Anything you definitely do not want — colors, styles, layouts, energy.</div>
        <textarea style={{...st.input,minHeight:56,resize:'vertical',lineHeight:1.6}} value={profile.inspoAvoid||''} onChange={e=>upd('inspoAvoid',e.target.value)} placeholder={'e.g. Dark backgrounds, overly corporate feels, clip art, Comic Sans energy'}/>
      </div>
    </div>
    {/* ── Privacy policy ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.12)'}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Privacy policy</div>
      <div style={{background:'rgba(107,63,42,0.05)',borderLeft:'2px solid rgba(107,63,42,0.2)',padding:'10px 14px',marginBottom:14,fontSize:12.5,color:'#4D433B',lineHeight:1.7}}>
        Because your site will collect visitor information through forms, a privacy policy is a legal requirement. The Pier Collective offers Termageddon — an auto-updating privacy policy service that keeps you covered as laws change. Setup is $49 + $129/year, and we handle everything.
      </div>
      <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:8}}>Would you like to add Termageddon to your plan?</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {['Yes — please add Termageddon to my plan','No — I already have a privacy policy','No — I will handle it myself later'].map(opt=>(
          <button key={opt} onClick={()=>upd('termageddon',opt)} style={{background:profile.termageddon===opt?bpMeta.color:'#fff',color:profile.termageddon===opt?'white':'#4D433B',border:`1px solid ${profile.termageddon===opt?bpMeta.color:'rgba(107,63,42,0.15)'}`,borderRadius:2,padding:'7px 14px',fontFamily:'Instrument Sans, sans-serif',fontSize:12.5,cursor:'pointer',transition:'all 0.15s'}}>{opt}</button>
        ))}
      </div>
    </div>
    {/* ── Anything else ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(107,63,42,0.12)',marginBottom:28}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Anything else?</div>
      <div style={{fontSize:12,color:'#8B7B6F',marginBottom:8}}>Anything else you would like Victoria to know about your business or your vision for the site.</div>
      <textarea style={{...st.input,minHeight:80,resize:'vertical',lineHeight:1.6}} value={profile.anythingElse||''} onChange={e=>upd('anythingElse',e.target.value)} placeholder={'e.g. I want the site to feel very different from competitors in my area. I also have a launch date in mind — April 1st.'}/>
    </div>
    <button onClick={onNext} style={{background:bpMeta.color,color:'#fff',border:'none',borderRadius:2,padding:'10px 24px',fontFamily:'Instrument Sans, sans-serif',fontSize:13.5,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
      Next: Design preferences →
    </button>
  </div>;
}

/* ─── Main Intake ────────────────────────────────────────── */
function Intake({profile,driveUrl,bpMeta,pages,bpKey,tier,design,onGoToProfile,onGoToDesign}){
  const ALL=pages.flatMap(p=>p.sections.map(s=>({...s,page:p})));
  const[step,setStep]=useState(0);
  const[data,setData]=useState({});
  const[done,setDone]=useState(new Set());
  const[ai,setAi]=useState(false);
  const[submitted,setSubmitted]=useState(false);
  const[submitting,setSubmitting]=useState(false);
  const[error,setError]=useState('');
  const isMobile=useIsMobile();
  const tourKey=`tpc_tour_done_${bpKey}`;
  const[showTour,setShowTour]=useState(false);
  useEffect(()=>{
    try{ if(!localStorage.getItem(tourKey))setShowTour(true); }catch(e){}
  },[]);
  const dismissTour=()=>{
    try{localStorage.setItem(tourKey,'1');}catch(e){}
    setShowTour(false);
  };
  const total=ALL.length;
  const cur=ALL[step];
  const pct=Math.round(done.size/total*100);
  const setField=(sid,fid,v)=>setData(p=>({...p,[sid]:{...(p[sid]||{}),[fid]:v}}));
  const get=(sid,fid,def)=>data[sid]?.[fid]??def;
  const next=()=>{setDone(p=>new Set([...p,step]));setAi(false);if(step<total-1)setStep(step+1);};
  const back=()=>{setAi(false);if(step>0)setStep(step-1);};
  const jump=i=>{setAi(false);setStep(i);};
  const promptText=cur.prompt?cur.prompt(profile):'';

  const handleSubmit=async()=>{
    setSubmitting(true);setError('');setDone(p=>new Set([...p,step]));
    try{
      const payload=buildPayload(bpKey,tier,profile,data,pages,design);
      const res=await fetch(FORMSPREE,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
      if(res.ok){setSubmitted(true);}else{setError('Something went wrong. Please try again or email your content directly to Victoria.');}
    }catch(e){setError('Network error. Please check your connection and try again.');}
    finally{setSubmitting(false);}
  };

  if(submitted)return<div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#FBF8F1',textAlign:'center',padding:40}}>
    <div style={{width:52,height:52,background:bpMeta.color,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,fontSize:22,color:'white'}}>✓</div>
    <h1 style={{fontFamily:'Fraunces, serif',fontSize:28,fontWeight:350,color:'#27231E',marginBottom:8}}>Content submitted</h1>
    <p style={{fontSize:14,color:'#8B7B6F',lineHeight:1.7,maxWidth:380,marginBottom:24}}>Your content is on its way to Victoria. She will review everything and be in touch within 2 business days. Your site will be live within two weeks of receiving complete content.</p>
    <div style={{padding:'14px 20px',background:`${bpMeta.color}0e`,borderRadius:2,borderLeft:`2px solid ${bpMeta.color}`,fontSize:13,color:'#4D433B',maxWidth:380,textAlign:'left'}}>
      <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>What happens next</div>
      Victoria reviews your content and follows up with any clarifying questions. Once confirmed, your build begins.
    </div>
  </div>;

  return<>
    {showTour&&<TourOverlay bpMeta={bpMeta} onDone={dismissTour} isMobile={isMobile}/>}
    {/* Top header bar */}
    <div style={{height:50,background:'#27231E',display:'flex',alignItems:'center',gap:isMobile?8:12,padding:isMobile?'0 14px':'0 20px',flexShrink:0}}>
      {!isMobile&&<span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>}
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:bpMeta.color,background:`${bpMeta.color}22`,padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase',flexShrink:0}}>{bpMeta.name.replace(' Blueprint','')}</span>
      <div style={{flex:1,height:3,background:'rgba(255,255,255,0.1)',borderRadius:2,overflow:'hidden'}}>
        <div style={{height:'100%',background:bpMeta.color,width:pct+'%',transition:'width 0.4s ease'}}/>
      </div>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,0.35)',flexShrink:0}}>{done.size}/{total}</span>
      {isMobile&&<button onClick={()=>setShowTour(true)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:16,cursor:'pointer',padding:'0 4px',flexShrink:0}} title="Show tour">?</button>}
    </div>
    {/* Mobile section indicator */}
    {isMobile&&<div style={{background:'#1E1A16',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'7px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)'}}>{cur.page.name}</span>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'0.06em',color:bpMeta.color}}>{cur.name.replace(' [Elevate]','').replace(' [New]','').substring(0,32)}</span>
    </div>}
    <div style={{flex:1,display:'flex',overflow:'hidden'}}>
      {/* Sidebar — desktop only */}
      {!isMobile&&<div style={{width:196,background:'#27231E',overflowY:'auto',flexShrink:0,padding:'8px 0 24px'}}>
        {/* Back to earlier steps */}
        <div style={{padding:'10px 14px 6px',borderBottom:'1px solid rgba(255,255,255,0.06)',marginBottom:6}}>
          <button onClick={onGoToProfile} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',padding:'4px 6px 4px 0',cursor:'pointer',color:'rgba(255,255,255,0.35)',fontFamily:'Instrument Sans, sans-serif',fontSize:11,width:'100%',textAlign:'left',transition:'color 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
            <span style={{fontSize:9}}>←</span> Business Profile
          </button>
          <button onClick={onGoToDesign} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',padding:'4px 6px 4px 0',cursor:'pointer',color:'rgba(255,255,255,0.35)',fontFamily:'Instrument Sans, sans-serif',fontSize:11,width:'100%',textAlign:'left',transition:'color 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
            <span style={{fontSize:9}}>←</span> Design Preferences
          </button>
        </div>
        {pages.map(pg=>{
          const si=ALL.findIndex(s=>s.page.id===pg.id);
          return<div key={pg.id}>
            <div onClick={()=>jump(si)} style={{padding:'8px 14px 5px',fontFamily:'DM Mono, monospace',fontSize:9.5,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',display:'flex',alignItems:'center',gap:6,cursor:'pointer',userSelect:'none'}}>
              <span style={{fontSize:8.5,background:'rgba(255,255,255,0.07)',borderRadius:2,padding:'1px 5px'}}>{pg.num}</span>
              {pg.name}
              {pg.tag&&<span style={{fontSize:8,color:bpMeta.color,opacity:0.7}}>E</span>}
            </div>
            {pg.sections.map(sec=>{
              const idx=ALL.findIndex(s=>s.id===sec.id&&s.page.id===pg.id);
              const isOn=idx===step,isDn=done.has(idx);
              return<div key={sec.id} className={`sb-s${isOn?' on':''}${isDn&&!isOn?' dn':''}`} style={{'--bp-color':bpMeta.color}} onClick={()=>jump(idx)}>
                <div style={{width:5,height:5,borderRadius:'50%',background:isDn?bpMeta.color:'rgba(255,255,255,0.15)',flexShrink:0}}/>
                {sec.name.replace(' [Elevate]','').replace(' [New]','').substring(0,30)}
              </div>;
            })}
          </div>;
        })}
      </div>}
      {/* Main content area */}
      <div style={{flex:1,overflowY:'auto',padding:isMobile?'18px 16px 100px':'26px 34px 40px',background:'#FBF8F1'}}>
        {!isMobile&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color}}>
          Page {cur.page.num} — {cur.page.name}
        </div>}
        <h1 style={{fontFamily:'Fraunces, serif',fontSize:isMobile?20:23,fontWeight:350,color:'#27231E',lineHeight:1.2,margin:isMobile?'6px 0 2px':'4px 0 2px'}}>
          {cur.name.replace(' [Elevate]','').replace(' [New]','')}
          {cur.tag&&<span style={{fontSize:12,fontWeight:400,color:bpMeta.color,marginLeft:8,fontFamily:'Instrument Sans, sans-serif'}}>{cur.tag}</span>}
        </h1>
        {cur.sub&&<p style={{fontSize:13,color:'#8B7B6F',marginBottom:16}}>{cur.sub}</p>}
        {cur.why&&<div style={{background:`${bpMeta.color}0e`,borderLeft:`2px solid ${bpMeta.color}`,padding:'10px 14px',marginBottom:22,fontSize:13,lineHeight:1.65,color:'#4D433B'}}>
          <span style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,display:'block',marginBottom:4}}>Why it matters</span>
          {cur.why}
        </div>}
        {cur.fields.map(f=><div key={f.id} style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:500,color:'#27231E',marginBottom:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{f.label}</span>
            {f.guidance&&(f.type==='text'||f.type==='sel'||f.type==='checks')&&<span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'#8B7B6F'}}>{f.guidance}</span>}
          </div>
          <Field f={f} val={get(cur.id,f.id,f.type==='checks'||f.type==='cards'||f.type==='rep'?[]:'')} onChange={v=>setField(cur.id,f.id,v)} driveUrl={driveUrl} bpColor={bpMeta.color}/>
        </div>)}
        {promptText&&<div style={{marginTop:4}}>
          <button className="ai-btn" onClick={()=>setAi(!ai)} style={{background:'none',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:'6px 12px',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:'#8B7B6F',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5,transition:'all 0.15s'}}>
            ✦ AI writing prompt {ai?'↑':'↓'}
          </button>
          {ai&&<div style={{background:'#27231E',borderRadius:2,padding:14,marginTop:9}}>
            <div style={{fontFamily:'DM Mono, monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:7}}>Copy, fill in any bracketed details, paste into Claude or ChatGPT</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.75)',lineHeight:1.75,fontStyle:'italic',whiteSpace:'pre-wrap'}}>{promptText}</div>
          </div>}
        </div>}
        {error&&<div style={{marginTop:16,padding:'10px 14px',background:'rgba(148,67,28,0.08)',borderLeft:'2px solid #94431C',borderRadius:2,fontSize:13,color:'#94431C'}}>{error}</div>}
      </div>
    </div>
    <div style={{height:isMobile?64:60,background:'#fff',borderTop:'1px solid rgba(107,63,42,0.15)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'0 16px':'0 34px',flexShrink:0,position:isMobile?'sticky':'static',bottom:0,zIndex:10}}>
      <button onClick={back} disabled={step===0||submitting} style={{background:'none',color:'#4D433B',border:'1px solid rgba(107,63,42,0.15)',borderRadius:2,padding:isMobile?'9px 16px':'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:isMobile?13:13.5,cursor:step===0?'not-allowed':'pointer',opacity:step===0?0.35:1}}>← Back</button>
      {!isMobile&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8B7B6F'}}>{cur.page.name}</span>}
      {step<total-1
        ?<button onClick={next} style={{background:bpMeta.color,color:'#fff',border:'none',borderRadius:2,padding:isMobile?'9px 16px':'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:isMobile?13:13.5,fontWeight:500,cursor:'pointer'}}>Next →</button>
        :<button onClick={handleSubmit} disabled={submitting} style={{background:submitting?'#8B7B6F':bpMeta.color,color:'#fff',border:'none',borderRadius:2,padding:isMobile?'9px 14px':'8px 20px',fontFamily:'Instrument Sans, sans-serif',fontSize:isMobile?12.5:13.5,fontWeight:500,cursor:submitting?'not-allowed':'pointer',transition:'background 0.2s'}}>
          {submitting?'Sending…':'Submit content ✓'}
        </button>}
    </div>
  </>;
}

/* ─── App Shell ──────────────────────────────────────────── */
export default function App(){
  const[screen,setScreen]=useState('landing');
  const[profile,setProfile]=useState({});
  const[design,setDesign]=useState({paletteId:'A',fontId:'A'});
  const driveUrl=getParam('drive');
  const bpKey=getParam('blueprint')||'quote';
  const tier=getParam('tier')||'emerge';
  const bpMeta=BP_META[bpKey]||BP_META.quote;
  const pages=getBlueprintPages(bpKey,tier);

  useEffect(()=>{
    document.documentElement.style.setProperty('--bp-color',bpMeta.color);
  },[]);

  const Header=()=><div style={{height:50,background:'#27231E',display:'flex',alignItems:'center',gap:12,padding:'0 20px',flexShrink:0}}>
    <span style={{fontFamily:'Fraunces, serif',fontSize:14,fontWeight:350,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
    <span style={{fontFamily:'DM Mono, monospace',fontSize:10,color:bpMeta.color,background:`${bpMeta.color}22`,padding:'3px 8px',borderRadius:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>{bpMeta.name.replace(' Blueprint','')} · {bpMeta.name==='Speaker Blueprint'?'One-Page':(tier==='elevate'?'Elevate':'Emerge')}</span>
  </div>;

  if(screen==='generator')return<><style>{FONTS+INTAKE_CSS}</style><LinkGenerator onBack={()=>setScreen('landing')}/></>;

  return<>
    <style>{FONTS+INTAKE_CSS}</style>
    <div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
      {screen==='landing'&&<LandingPage onStart={()=>setScreen('profile')} driveUrl={driveUrl} bpMeta={bpMeta} tier={tier} onGenerator={()=>setScreen('generator')}/>}
      {screen==='profile'&&<><Header/><div style={{flex:1,overflowY:'auto'}}><ProfileStep profile={profile} setProfile={setProfile} onNext={()=>setScreen('design')} bpMeta={bpMeta}/></div></>}
      {screen==='design'&&<><Header/><div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column'}}><DesignStep bpKey={bpKey} bpMeta={bpMeta} design={design} setDesign={setDesign} onNext={()=>setScreen('intake')} onBack={()=>setScreen('profile')}/></div></>}
      {screen==='intake'&&<Intake profile={profile} driveUrl={driveUrl} bpMeta={bpMeta} pages={pages} bpKey={bpKey} tier={tier} design={design} onGoToProfile={()=>setScreen('profile')} onGoToDesign={()=>setScreen('design')}/>}
    </div>
  </>;
}
