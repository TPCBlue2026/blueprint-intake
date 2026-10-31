import React, { useState, useEffect } from "react";

const D='#141314',BG='#FCF9F5',TX='#141314',MU='#7A7069',BO='rgba(20,19,20,0.12)';
const FORMSPREE='https://formspree.io/f/xgoqqepp';

const BP_META = {
  quote:        { name:'Quote Blueprint',        color:'#3041F0', cta:'Get a Free Quote',     industry:'local service businesses' },
  consultation: { name:'Consultation Blueprint', color:'#3041F0', cta:'Book a Call',           industry:'coaches, consultants, therapists, advisors' },
  booking:      { name:'Booking Blueprint',      color:'#3041F0', cta:'Book an Appointment',  industry:'salons, spas, appointment-based businesses' },
  inquiry:      { name:'Inquiry Blueprint',      color:'#3041F0', cta:'Start Your Inquiry',   industry:'photographers, event vendors, creative businesses' },
  shop:         { name:'Shop Blueprint',         color:'#3041F0', cta:'Shop Now',             industry:'makers, artisans, product-based businesses' },
  speaker:      { name:'Speaker Blueprint',      color:'#3041F0', cta:'Inquire About Booking', industry:'professional speakers, trainers, and workshop facilitators' },
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
  const pages=tier === 'elevate' ? (allElevate[bp] || allElevate.quote) : (allEmerge[bp] || allEmerge.quote);
  if(!ACTIVE_BLUEPRINTS.includes(bp))return pages;
  return pages.map(page=>({...page,sections:[...page.sections,...(EXTRA_SECTIONS[bp]?.[page.id]||[])]}));
}

const EXTRA_SECTIONS={
 consultation:{bookcall:[{id:'before_book',name:'Before you book',sub:'Help visitors know whether this conversation is right for them',why:'Set expectations about who the call serves, preparation, cost, and the next step.',fields:[{id:'fit',label:'Who the call is for',type:'textarea',guidance:'25–50 words',ph:'Describe the right fit without excluding people unfairly.'},{id:'prep',label:'What to prepare and whether there is a fee',type:'textarea',guidance:'15–40 words',ph:'Confirm actual details from Business Details.'}]}]},
 booking:{services:[{id:'before_appointment',name:'Before your appointment',sub:'First-time visitor guidance',why:'Explain preparation, location, and how to choose a service.',fields:[{id:'choose',label:'How to choose the right appointment',type:'textarea',guidance:'30–60 words',ph:'Help a first-time client pick the right service.'},{id:'prepare',label:'Preparation and arrival details',type:'textarea',guidance:'30–60 words',ph:'Use your confirmed policies and location.'}]}]},
 quote:{services:[{id:'quote_factors',name:'What affects your quote',sub:'Set expectations without guessing prices',why:'Explain which job factors change the estimate and whether there are minimums.',fields:[{id:'factors',label:'What determines the quote',type:'textarea',guidance:'40–70 words',ph:'Size, scope, materials, access, timeline, etc., only if accurate.'},{id:'minimum',label:'Minimum job or estimate fee note (if applicable)',type:'textarea',guidance:'Optional',ph:'Leave blank if not applicable.'}]}]},
 inquiry:{inquire:[{id:'project_fit',name:'Is this the right fit?',sub:'Project qualification before submission',why:'Help visitors determine whether to inquire based on project type, budget, and timeline.',fields:[{id:'fit',label:'Projects that are a good fit',type:'textarea',guidance:'30–60 words',ph:'Use your confirmed services and project criteria.'},{id:'timing',label:'Budget and timing expectations (if applicable)',type:'textarea',guidance:'20–50 words',ph:'Only include confirmed minimums and lead times.'}]}]},
};
// The learning prompt is copied into the client's chosen AI conversation before any section prompts.
const PROFILE_LABELS = [
  ['biz','Business name'],['owner','Owner / primary contact'],['type','Business type'],
  ['area','Location / service area'],['since','Year established'],['ideal','Ideal customer'],
  ['differentiator','What makes this business different'],['tone','Preferred writing voice'],
  ['email','Public business email'],['phone','Public business phone'],
  ['address','Public business address'],['existingUrl','Existing website'],
  ['otherLinks','Other online presence'],['existingColors','Existing brand colors'],
  ['existingFonts','Existing brand fonts'],['inspoLove','Visual inspiration they like'],
  ['inspoAvoid','Visual approaches to avoid'],['anythingElse','Additional business context'],
];
const BUSINESS_QUESTIONS = {
  shared:[
    {id:'services',label:'What services or packages do you actually offer?',hint:'List each service and explain what is included. These facts will be used across your website.',kind:'services'},
    {id:'audience',label:'Who is each service best suited for?',hint:'Include any situations or clients you do not serve.'},
    {id:'process',label:'What happens from first contact through completing the work?',hint:'Describe the real steps, not a polished marketing version.',kind:'process'},
    {id:'pricing',label:'How do you charge and what can customers expect?',hint:'Include confirmed starting prices, rates, or how pricing is determined.',kind:'pricing'},
    {id:'proof',label:'What evidence of your work can you share?',hint:'Reviews, projects, results you can verify, credentials, or examples. It is fine to be new.'},
    {id:'questions',label:'What do customers ask or worry about most?',hint:'List the questions you answer repeatedly.'},
    {id:'response',label:'What happens immediately after someone takes the website’s main action?',hint:'Include how you respond and the realistic timeframe.',kind:'process'},
  ],
  quote:[
    {id:'serviceArea',label:'Which locations and types of jobs do you accept?'},
    {id:'minimums',label:'Are there minimum job sizes, exclusions, or eligibility requirements?',kind:'pricing'},
    {id:'estimates',label:'How are estimates prepared? Are they free, remote, or on-site?',kind:'pricing'},
    {id:'factors',label:'What affects the final quote?',hint:'Examples: job size, materials, condition, travel, urgency.',kind:'pricing'},
    {id:'validity',label:'How long are quotes valid, and what happens after acceptance?',kind:'process'},
  ],
  consultation:[
    {id:'fit',label:'Who is a good fit for a consultation, and who is not?'},
    {id:'call',label:'How long is the first call, where does it happen, and is preparation needed?',kind:'process'},
    {id:'afterCall',label:'What do you recommend or send after the call, and when?',kind:'process'},
    {id:'engagement',label:'What do clients receive, and how long do engagements typically last?',kind:'services'},
  ],
  booking:[
    {id:'appointments',label:'What are the durations, prices, and inclusions of each appointment?',kind:'services'},
    {id:'location',label:'Where do appointments take place, and what should clients know about arrival?'},
    {id:'preparation',label:'How should clients prepare, and is there any aftercare?',kind:'process'},
    {id:'cancellation',label:'What is your cancellation and rescheduling policy?',kind:'policy'},
    {id:'deposits',label:'Do you require deposits, and how are late arrivals or no-shows handled?',kind:'policy'},
    {id:'bookingTool',label:'Which client-managed booking tool or link do you use?',hint:'Leave blank if you need to choose a compatible tool.'},
  ],
  inquiry:[
    {id:'projects',label:'What project types and deliverables do you accept?',kind:'services'},
    {id:'fit',label:'Which projects are a strong fit, and which are outside your scope?'},
    {id:'budget',label:'Do you have a starting investment or minimum project budget?',kind:'pricing'},
    {id:'timing',label:'How far in advance should clients inquire, and what is your availability?',kind:'process'},
    {id:'selection',label:'How do you review and select inquiries?',kind:'process'},
    {id:'portfolio',label:'Which projects can you show, and what was your role in each?',hint:'Include project type, brief context, and any permitted client details.'},
  ],
};
const ACTIVE_BLUEPRINTS=['quote','consultation','booking','inquiry'];
function detailQuestions(bpKey){return [...BUSINESS_QUESTIONS.shared,...(BUSINESS_QUESTIONS[bpKey]||[])];}
function buildDecisionPrompt(q,profile,bpKey){
  const meta=BP_META[bpKey]||BP_META.quote;
  return `Continue in the same AI conversation as my Business Learning Prompt. I am preparing my ${meta.name} website and have not yet established this business decision: ${q.label}\n\nHelp me think it through rather than choosing for me. Ask up to three focused questions, then explain three practical options, including their advantages, tradeoffs, and effects on customers. Recommend a sensible starting point for a new ${profile.type||'service'} business, but clearly label it as a suggestion. Do not invent my policies, prices, credentials, or legal obligations. Flag anything that requires professional or local legal verification. Once I choose, draft concise, accurate business facts I can paste into my questionnaire. Do not treat a suggested option as confirmed until I approve it.`;
}
function BusinessDetailsStep({profile,details,setDetails,bpKey,bpMeta,onBack,onNext}){
  const [expanded,setExpanded]=useState({});
  const [copied,setCopied]=useState('');
