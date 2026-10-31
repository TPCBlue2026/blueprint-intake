          onKeyDown={e=>e.key==='Enter'&&tryUnlock()}
          placeholder="Password"
          style={{...st.input,marginBottom:err?8:0,borderColor:err?'#3041F0':'rgba(20,19,20,0.12)'}}
          autoFocus
        />
        {err&&<div style={{fontSize:12,color:'#3041F0',marginTop:4}}>Incorrect password. Try again.</div>}
      </div>
      <button onClick={tryUnlock} style={{background:'#141314',color:'white',border:'none',borderRadius:9999,padding:'12px 28px',fontFamily:"'Google Sans Flex', sans-serif",fontSize:13.5,fontWeight:500,cursor:'pointer',width:'100%'}}>
        Unlock →
      </button>
      <button onClick={onBack} style={{background:'none',border:'none',padding:0,fontFamily:"'Google Sans Flex', sans-serif",fontSize:12,color:'#7A7069',cursor:'pointer',marginTop:16,display:'block'}}>← Back to client view</button>
    </div>
  </div>;
  return<div style={{minHeight:'100vh',background:'#FCF9F5',fontFamily:"'Google Sans Flex', sans-serif",color:'#141314'}}>
    <div style={{height:50,background:'#141314',display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:14,fontWeight:400,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,color:'#C98D26',background:'rgba(201,141,38,0.2)',padding:'3px 8px',borderRadius:12,letterSpacing:'0.08em',textTransform:'uppercase'}}>Link Generator · Victoria</span>
    </div>
    <div style={{maxWidth:560,margin:'0 auto',padding:'48px 24px'}}>
      <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C98D26',marginBottom:8}}>For Victoria only</div>
      <h1 style={{fontSize:28,fontWeight:400,color:'#141314',marginBottom:8}}>
        <span style={{fontFamily:"'Google Sans Flex', sans-serif"}}>Generate a client </span>
        <span style={{fontFamily:"'Google Sans Flex', sans-serif",color:'#141314'}}>intake link</span>
      </h1>
      <p style={{fontSize:14,color:'#7A7069',lineHeight:1.7,marginBottom:32}}>Select the blueprint and tier, paste the client's Drive folder link, and copy the URL for their welcome email.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:'#141314',marginBottom:6}}>Blueprint</div>
          <select style={{...st.input,cursor:'pointer'}} value={bp} onChange={e=>setBp(e.target.value)}>
            {Object.entries(BP_META).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>
        {bp!=='speaker'&&<div>
          <div style={{fontSize:13,fontWeight:500,color:'#141314',marginBottom:6}}>Tier</div>
          <select style={{...st.input,cursor:'pointer'}} value={tier} onChange={e=>setTier(e.target.value)}>
            <option value="emerge">Emerge — $149/mo</option>
            <option value="elevate">Elevate — $349/mo</option>
          </select>
        </div>}
        {bp==='speaker'&&<div style={{background:`${meta.color}0e`,border:`1px solid ${meta.color}33`,borderRadius:12,padding:'10px 14px',display:'flex',alignItems:'center'}}>
          <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:meta.color}}>Flat Rate — $1,000</span>
        </div>}
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:500,color:'#141314',marginBottom:6}}>Client Google Drive folder link</div>
        <input style={st.input} value={drive} onChange={e=>setDrive(e.target.value)} placeholder='Paste the shared Drive folder URL here'/>
        <div style={{fontSize:12,color:'#7A7069',marginTop:5}}>Set folder to "Anyone with the link can view" before sending.</div>
      </div>
      <div style={{background:'#fff',border:'1px solid rgba(20,19,20,0.12)',borderRadius:12,padding:16,marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:meta.color,flexShrink:0}}/>
          <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A7069'}}>{meta.name} · {meta.name==='Speaker Blueprint'?'One-Page':(tier==='elevate'?'Elevate':'Emerge')}</span>
        </div>
        <div style={{fontSize:12,color:'#141314',wordBreak:'break-all',lineHeight:1.6,marginBottom:12}}>{link}</div>
        <button onClick={copy} style={{background:copied?'rgba(91,109,74,0.12)':'rgba(20,19,20,0.04)',border:'1px solid rgba(20,19,20,0.12)',borderRadius:9999,padding:'7px 14px',fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:copied?'#5B6D4A':'#7A7069',cursor:'pointer',transition:'all 0.15s'}}>
          {copied?'✓ Copied!':'Copy link'}
        </button>
      </div>
      <div style={{background:'rgba(91,109,74,0.06)',borderLeft:'2px solid #5B6D4A',borderRadius:'0 2px 2px 0',padding:'12px 16px',fontSize:13,color:'#141314',lineHeight:1.65,marginBottom:32}}>
        <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5B6D4A',marginBottom:4}}>How to use</div>
        Select the blueprint and tier from the discovery call. Paste the client's Drive folder link. Copy the URL and paste into their welcome email. The intake loads pre-configured for their build.
      </div>
      <button onClick={onBack} style={{background:'none',border:'none',padding:0,fontFamily:"'Google Sans Flex', sans-serif",fontSize:13,color:'#7A7069',cursor:'pointer'}}>← Back</button>
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
  return<div style={{minHeight:'100vh',background:'#FCF9F5',fontFamily:"'Google Sans Flex', sans-serif",color:'#141314'}}>
    <div style={{height:50,background:'#141314',display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:14,fontWeight:400,color:'white',letterSpacing:'0.02em'}}>The Blueprint System</span>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,color:'rgba(255,255,255,0.9)',background:'rgba(255,255,255,0.12)',padding:'3px 8px',borderRadius:12,letterSpacing:'0.04em',textTransform:'uppercase',flexShrink:0}}>{bpMeta.name} · {bpMeta.name==='Speaker Blueprint'?'One-Page':(tier==='elevate'?'Elevate':'Emerge')}</span>
    </div>
    <div style={{maxWidth:600,margin:'0 auto',padding:'36px 18px 60px'}}>
      <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:10}}>Your website starts here</div>
      <h1 style={{fontSize:38,fontWeight:400,color:'#141314',lineHeight:1.2,marginBottom:16,letterSpacing:'-0.01em'}}>
        <span style={{fontFamily:"'Google Sans Flex', sans-serif"}}>Let's build your site.</span><br/>
        <span style={{fontFamily:"'Google Sans Flex', sans-serif",color:'#141314'}}>Start with your content.</span>
      </h1>
      <p style={{fontSize:16,color:'#141314',lineHeight:1.7,marginBottom:12}}>This intake walks you through every section of your {bpMeta.name} — one at a time, in the same order your site is built. For each section you will find clear guidance on what to write, how long it should be, and why it matters.</p>
      <p style={{fontSize:16,color:'#141314',lineHeight:1.7,marginBottom:32}}>When you submit, Victoria receives everything organized and ready to build from. Most clients finish in <strong>{timeEstimate}</strong>.</p>
      <div style={{background:'#fff',border:'1px solid rgba(20,19,20,0.12)',borderRadius:12,padding:20,marginBottom:32}}>
        <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Before you start — have these ready</div>
        {checklist.map((item,i)=><div key={i} style={{display:'flex',gap:12,marginBottom:10,fontSize:13.5,color:'#141314',lineHeight:1.5}}>
          <div style={{width:20,height:20,background:`${bpMeta.color}18`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,color:bpMeta.color,fontWeight:500,marginTop:1}}>{i+1}</div>
          {item}
        </div>)}
      </div>
      {driveUrl&&<div style={{background:`${bpMeta.color}0e`,border:`1px solid ${bpMeta.color}33`,borderRadius:12,padding:16,marginBottom:28,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:3}}>Your project folder</div>
          <div style={{fontSize:13,color:'#141314'}}>Upload your photos and files here as you go through the intake.</div>
        </div>
        <button onClick={()=>window.open(driveUrl,'_blank','noopener,noreferrer')} style={{background:bpMeta.color,color:'white',border:'none',borderRadius:9999,padding:'10px 22px',fontFamily:"'Google Sans Flex', sans-serif",fontSize:13,fontWeight:500,cursor:'pointer',flexShrink:0}}>
          📁 Open folder →
        </button>
      </div>}
      <div style={{background:'#141314',borderRadius:12,padding:'16px 20px',marginBottom:32,fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:1.7}}>
        <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,display:'block',marginBottom:4}}>AI writing prompts</span>
        After completing your Business Profile, you will receive a personalized learning prompt. Paste it into your chosen AI first, then use each page and section prompt in that same conversation. Check every draft for accuracy and make it yours.
      </div>
      <button className="lp-btn" onClick={onStart} style={{background:bpMeta.color,color:'white',border:'none',borderRadius:9999,padding:'15px 36px',fontFamily:"'Google Sans Flex', sans-serif",fontSize:18,fontWeight:400,cursor:'pointer',letterSpacing:'0.01em',transition:'all 0.15s',display:'inline-flex',alignItems:'center',gap:10}}>
        Start my intake →
      </button>
      <div style={{marginTop:40,paddingTop:24,borderTop:'1px solid rgba(20,19,20,0.12)'}}>
        <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'#7A7069',marginBottom:8}}>For Victoria</div>
        <button onClick={onGenerator} style={{background:'none',border:'none',padding:0,fontFamily:"'Google Sans Flex', sans-serif",fontSize:13,color:bpMeta.color,cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>Generate a client intake link →</button>
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
    <div style={{fontSize:13,fontWeight:500,color:'#141314',marginBottom:4}}>{label}</div>
    {hint&&<div style={{fontSize:12,color:'#7A7069',marginBottom:6}}>{hint}</div>}
    <input style={st.input} value={profile[key]||''} onChange={e=>upd(key,e.target.value)} placeholder={ph}/>
  </div>;
  return<div style={{flex:1,overflowY:'auto',padding:'26px 34px 40px',background:'#FCF9F5'}}>
    <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Step 01 of 03</div>
    <h1 style={{fontSize:26,fontWeight:400,color:'#141314',lineHeight:1.2,margin:'0 0 4px'}}>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif"}}>Business </span>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif",color:'#141314'}}>profile</span>
    </h1>
    <p style={{fontSize:13,color:'#7A7069',marginBottom:20}}>First, tell us about your business. Next, you will get one personalized prompt to teach your chosen AI about it before you start writing your website.</p>
    <div style={{background:`${bpMeta.color}0e`,borderLeft:`2px solid ${bpMeta.color}`,padding:'10px 14px',marginBottom:24,fontSize:13,lineHeight:1.65,color:'#141314'}}>
      <span style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,display:'block',marginBottom:4}}>How this is used</span>
      Your answers will be used to generate a business learning prompt for you to review and copy into an AI tool of your choice. They are also included in your completed intake submission. Only share information you are comfortable sending to that AI provider.
    </div>
    {pf(bpMeta.name==='Speaker Blueprint'?'Your name':'Business name','biz',bpMeta.name==='Speaker Blueprint'?'e.g. Dr. Sabrina Jackson':'e.g. Austin Greenworks · Naomi Crawford Photography',null)}
    {pf('Your name (owner)','owner','e.g. Marcus Johnson · Naomi Crawford',null)}
    {pf(bpMeta.name==='Speaker Blueprint'?'What you speak about':'Type of business','type',bpMeta.name==='Speaker Blueprint'?'e.g. leadership, creative resilience, burnout recovery':'e.g. landscaping company · wedding photographer · licensed esthetician','Be specific — this goes directly into your AI prompts.')}
    {pf(bpMeta.name==='Speaker Blueprint'?'Where you\'re based':'Primary service area or location','area',bpMeta.name==='Speaker Blueprint'?'e.g. Based in Detroit · available to travel':'e.g. Austin, TX · Portland, Oregon',bpMeta.name==='Speaker Blueprint'?'Speakers can note travel availability here.':'City and region or full coverage area.')}
    {pf('In business since (year)','since','e.g. 2014',null)}
    {pf(bpMeta.name==='Speaker Blueprint'?'Your ideal audience or event type':'Your ideal customer','ideal',bpMeta.name==='Speaker Blueprint'?'e.g. corporate leadership conferences · university audiences · women\'s retreats':'e.g. busy Austin homeowners · couples planning intimate Portland weddings',bpMeta.name==='Speaker Blueprint'?'The audience or event type you\'re the best fit for.':'The person most likely to hire you or buy from you.')}
    <div style={{marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:500,color:'#141314',marginBottom:4}}>What sets you apart</div>
      <div style={{fontSize:12,color:'#7A7069',marginBottom:6}}>The one or two things that genuinely differentiate you from anyone else doing what you do.</div>
      <textarea style={{...st.input,minHeight:72,resize:'vertical',lineHeight:1.6}} value={profile.differentiator||''} onChange={e=>upd('differentiator',e.target.value)} placeholder='e.g. Same-day quotes guaranteed · or · I only take 20 weddings a year so every client gets my full attention · or · All products handmade in small batches with organic ingredients'/>
    </div>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:13,fontWeight:500,color:'#141314',marginBottom:8}}>Tone preference</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {TONE_OPTIONS.map(t=><button key={t} onClick={()=>upd('tone',t)} style={{background:profile.tone===t?bpMeta.color:'#fff',color:profile.tone===t?'white':'#141314',border:`1px solid ${profile.tone===t?bpMeta.color:'rgba(20,19,20,0.12)'}`,borderRadius:9999,padding:'7px 14px',fontFamily:"'Google Sans Flex', sans-serif",fontSize:13,cursor:'pointer',transition:'all 0.15s'}}>{t}</button>)}
      </div>
    </div>

    {/* ── Contact details ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(20,19,20,0.10)'}}>
      <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Contact details</div>
      {pf('Business email address','email','e.g. hello@yourbusiness.com','This will be used for site contact forms and is not shared with anyone.')}
      {pf('Business phone number (optional)','phone','e.g. (512) 555-0123',null)}
      {pf('Business address (if brick and mortar or service area)','address','e.g. 123 Main St, Austin TX 78701 · or · Serving all of Metro Detroit',null)}
    </div>
    {/* ── Online presence ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(20,19,20,0.10)'}}>
      <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:14}}>Online presence</div>
      {pf('Existing website URL (if you have one)','existingUrl','e.g. https://www.yoursite.com · or · None',null)}
      {pf('Any other online presence','otherLinks','e.g. Linktree, Etsy shop, Google Business Profile — paste links separated by commas',null)}
    </div>
    {/* ── Existing brand ── */}
    <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid rgba(20,19,20,0.10)'}}>
      <div style={{fontFamily:"'Google Sans Flex', sans-serif",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:bpMeta.color,marginBottom:6}}>Existing brand (if you have one)</div>
      <p style={{fontSize:12,color:'#7A7069',marginBottom:14,lineHeight:1.6}}>If you already have brand colors and fonts, enter them here. If you are starting fresh, leave these blank — you will choose your palette and font pairing on the next step.</p>
      {pf('Existing brand colors (hex codes)','existingColors','e.g. #2C4A3E, #F5F0E8, #C4956A · or · None yet — I\'ll choose on the next step',null)}
      {pf('Existing brand fonts (if you know them)','existingFonts','e.g. Playfair Display for headings, Lato for body · or · None yet',null)}
    </div>
    {/* ── Inspiration ── */}
