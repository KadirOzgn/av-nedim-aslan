(function(global){
  'use strict';

  const data = global.WORK_DATA;
  const MS_DAY = 86400000;
  const AUTOMATIC_RECESS_INPUTS = new Set(['court_vacation_applicable','hmk_103_exception']);

  function parseISO(s){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||''))) return null;
    const [y,m,d]=s.split('-').map(Number);
    const dt=new Date(Date.UTC(y,m-1,d));
    if(dt.getUTCFullYear()!==y || dt.getUTCMonth()!==m-1 || dt.getUTCDate()!==d) return null;
    return dt;
  }
  function iso(dt){ return dt.toISOString().slice(0,10); }
  function addDays(date,n){ const d=new Date(date.getTime()); d.setUTCDate(d.getUTCDate()+Number(n)); return d; }
  function daysInMonth(y,m0){ return new Date(Date.UTC(y,m0+1,0)).getUTCDate(); }
  function addMonthsClamped(date,n){
    date = typeof date==='string' ? parseISO(date) : date;
    if(!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
    const y=date.getUTCFullYear(), m=date.getUTCMonth(), day=date.getUTCDate();
    const targetIndex=m+Number(n);
    const ty=y+Math.floor(targetIndex/12);
    const tm=((targetIndex%12)+12)%12;
    return new Date(Date.UTC(ty,tm,Math.min(day,daysInMonth(ty,tm))));
  }
  function addYearsClamped(date,n){
    date = typeof date==='string' ? parseISO(date) : date;
    if(!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
    const y=date.getUTCFullYear()+Number(n), m=date.getUTCMonth(), day=date.getUTCDate();
    return new Date(Date.UTC(y,m,Math.min(day,daysInMonth(y,m))));
  }
  function fmtTR(s){
    const d=typeof s==='string'?parseISO(s):s;
    if(!d) return '—';
    return new Intl.DateTimeFormat('tr-TR',{timeZone:'UTC',day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
  }
  function money(v){ return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(Number(v||0)); }

  const holidayByDate = new Map();
  for(const h of data.holidays_2026_2035){
    if(!holidayByDate.has(h.date)) holidayByDate.set(h.date,[]);
    holidayByDate.get(h.date).push(h);
  }
  const calendarFromYear=Number(data.calendar_coverage?.from_year||2026);
  const calendarToYear=Number(data.calendar_coverage?.to_year||2035);
  function calendarCoversDate(date){
    const d=typeof date==='string'?parseISO(date):date;
    if(!(d instanceof Date)||Number.isNaN(d.getTime())) return false;
    const year=d.getUTCFullYear();
    return year>=calendarFromYear&&year<=calendarToYear;
  }
  function holidayInfo(date){ return holidayByDate.get(iso(date))||[]; }
  function isWeekend(date){ const x=date.getUTCDay(); return x===0||x===6; }
  function hasFullHoliday(date){ return holidayInfo(date).some(h=>h.kind==='Tam gün'); }
  function hasHalfHoliday(date){ return holidayInfo(date).some(h=>h.kind==='Yarım gün'); }
  function isWorkingDay(date){ return calendarCoversDate(date) ? !isWeekend(date) && !hasFullHoliday(date) : null; }
  function nextWorkingDay(date){
    let d=new Date(date);
    for(let guard=0;guard<370;guard++){
      const working=isWorkingDay(d);
      if(working===null) return null;
      if(working) return d;
      d=addDays(d,1);
    }
    return null;
  }
  function previousWorkingDay(date){
    let d=new Date(date);
    for(let guard=0;guard<370;guard++){
      const working=isWorkingDay(d);
      if(working===null) return null;
      if(working) return d;
      d=addDays(d,-1);
    }
    return null;
  }
  function addBusinessDays(date,n,{saturdayWorking=false}={}){
    const amount=Number(n);
    if(!Number.isInteger(amount)) return null;
    const direction=amount<0?-1:1;
    let d=new Date(date), c=0;
    while(c<Math.abs(amount)){
      d=addDays(d,direction);
      if(!calendarCoversDate(d)) return null;
      const dow=d.getUTCDay();
      const weekend=saturdayWorking ? dow===0 : (dow===0||dow===6);
      if(!weekend && !hasFullHoliday(d)) c++;
    }
    return d;
  }

  function addDuration(start,duration,unit,opts={}){
    const n=Number(duration);
    if(!Number.isFinite(n)) return null;
    switch(String(unit||'').toLowerCase()){
      case 'day': return addDays(start,n);
      case 'week': return addDays(start,n*7);
      case 'month': return addMonthsClamped(start,n);
      case 'year': return addYearsClamped(start,n);
      case 'business_day': return addBusinessDays(start,n,opts);
      default: return null;
    }
  }

  function inRange(date, monthDayStart, monthDayEnd){
    const y=date.getUTCFullYear();
    const s=parseISO(`${y}-${monthDayStart}`), e=parseISO(`${y}-${monthDayEnd}`);
    return date>=s && date<=e;
  }
  function ruleRecessPolicy(rule){
    const regime=String(rule?.regime||'').toUpperCase();
    const candidate=rule?.court_vacation_candidate===true;
    const exempt=rule?.court_vacation_exempt===true || (regime==='HMK' && rule?.hmk_103_exception===true);
    return {regime,applicable:candidate&&!exempt,exempt};
  }
  function automaticHmk103Exception(rule,input={}){
    if(String(rule?.regime||'').toUpperCase()!=='HMK') return false;
    if(rule?.court_vacation_exempt===true||rule?.hmk_103_exception===true) return true;
    if(['provisional_rejection','provisional_grant_present','objection_to_exparte'].includes(input.decision_kind)) return true;
    return !!input.hmk_vacation_class&&input.hmk_vacation_class!=='ordinary';
  }
  function applyRegimeVacation(date, regime, opts={}){
    const r=String(regime||'').toUpperCase();
    const applicable=opts.courtVacationApplicable===true || opts.automaticApplicable===true;
    let d=new Date(date), notes=[];
    if(r==='HMK' && applicable && !opts.hmk103Exception && inRange(d,'07-20','08-31')){
      d=parseISO(`${d.getUTCFullYear()}-09-08`);
      notes.push('HMK m.104: nominal son gün adli tatile rastladığı için motor süreyi otomatik olarak 8 Eylül’e uzattı.');
    } else if(r==='CMK' && applicable){
      const periodStart=typeof opts.periodStart==='string'?parseISO(opts.periodStart):opts.periodStart;
      const duration=Number(opts.duration);
      const unit=String(opts.unit||'');
      if(periodStart instanceof Date && !Number.isNaN(periodStart.getTime()) && inRange(periodStart,'07-20','08-31') && Number.isFinite(duration) && unit){
        const vacationEnd=parseISO(`${periodStart.getUTCFullYear()}-08-31`);
        const restarted=addDuration(vacationEnd,duration,unit,{saturdayWorking:opts.saturdayWorking===true});
        if(restarted){
          d=restarted;
          notes.push('CMK m.331/4: başlangıç olayı adli tatilde gerçekleşti; süre 1 Eylül’den itibaren tam olarak işletildi.');
          if(inRange(d,'07-20','08-31')){
            d=parseISO(`${d.getUTCFullYear()}-09-03`);
            notes.push('Yeniden hesaplanan CMK son günü de adli tatile rastladığı için 3 Eylül son gün kabul edildi.');
          }
        }
      } else if(inRange(d,'07-20','08-31')){
        d=parseISO(`${d.getUTCFullYear()}-09-03`);
        notes.push('CMK m.331/4: nominal son gün adli tatile rastladığı için motor süreyi otomatik olarak 3 Eylül’e uzattı.');
      }
    } else if(r==='IYUK' && applicable && inRange(d,'07-20','08-31')){
      d=parseISO(`${d.getUTCFullYear()}-09-07`);
      notes.push('İYUK m.8/3 ve m.61: nominal son gün çalışmaya ara verme zamanına rastladığı için motor süreyi otomatik olarak 7 Eylül’e uzattı.');
    }
    return {date:d,notes};
  }
  function applyFinalHoliday(date,{shift=true,holidayDirection='forward',submissionChannel,channelCutoffConfirmed=false,regime}={}){
    let d=new Date(date), notes=[], cutoff=submissionChannel==='electronic'&&String(regime||'').toUpperCase()==='HMK'?'gün sonu':'mesai bitimi';
    if(!calendarCoversDate(d)) return {status:'blocked',reason:`${d.getUTCFullYear()} yılı resmî tatil veri setinin (${calendarFromYear}–${calendarToYear}) dışında; tarih kaydırması yapılamaz.`};
    if(shift && isWorkingDay(d)===false){
      const old=iso(d);
      d=holidayDirection==='backward'?previousWorkingDay(d):nextWorkingDay(d);
      if(!d) return {status:'blocked',reason:'Son gün çalışma gününe taşınırken resmî tatil takvimi kapsamı dışına çıkıldı.'};
      notes.push(`Son gün ${fmtTR(old)} çalışma günü olmadığından ${fmtTR(d)} tarihine ${holidayDirection==='backward'?'geri':'ileri'} taşındı.`);
    }
    if(hasHalfHoliday(d)){
      if(submissionChannel==='physical'){
        cutoff='13:00';
        notes.push('Son gün yarım gün resmî tatile rastlıyor; fizikî başvuru için son saat 13:00 kabul edildi.');
      } else if(submissionChannel==='electronic'&&String(regime||'').toUpperCase()==='HMK'){
        cutoff='gün sonu';
        notes.push('HMK m.445/4 uyarınca elektronik işlem gün sonunda tamamlanabilir; yarım gün 13:00 kesimi uygulanmadı.');
      } else if(channelCutoffConfirmed===true){
        cutoff='doğrulanmış kanal kapanış saati';
        notes.push('Yarım gün için elektronik/kurumsal kanalın son saati kullanıcı tarafından dosyadan doğrulandı.');
      } else {
        return {status:'blocked',reason:'Son gün yarım gün resmî tatile rastlıyor. Fizikî/elektronik/kurumsal kanal ve uygulanacak son saat doğrulanmadan kesin sonuç üretilemez.'};
      }
    }
    return {status:'ok',date:d,notes,cutoff};
  }

  function resolveService(input){
    const type=input.type;
    let base, notes=[];
    if(type==='uets'){
      if(!input.evidenceVerified) return {status:'blocked',reason:'UETS delil kaydı doğrulanmadan hukuki tebliğ tarihi üretilemez.'};
      base=parseISO(input.arrivalDate);
      if(!base) return {status:'blocked',reason:'UETS elektronik adrese ulaşma tarihi zorunlu.'};
      const legal=addDays(base,5);
      notes.push('UETS: ulaşma günü sayılmadan izleyen 5. günün sonunda tebliğ edilmiş sayıldı; tatil nedeniyle kaydırılmadı.');
      return {status:'ok',legalDate:iso(legal),eventResolved:true,recipientResolved:false,notes};
    }
    if(type==='physical'){
      if(input.documentVerified!==true) return {status:'blocked',reason:'Fizikî tebligatta tebliğ mazbatası/dönüş belgesi doğrulanmadan tarih üretilemez.'};
      base=parseISO(input.deliveryDate); if(!base) return {status:'blocked',reason:'Usulüne uygun teslim tarihi zorunlu.'};
      return {status:'ok',legalDate:iso(base),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:['Fizikî tebligatta doğrulanmış mazbata/dönüş belgesindeki teslim tarihi esas alındı.']};
    }
    if(type==='tk21_1'){
      if(input.absenceOrRefusalConfirmed!==true||input.noticeProcedureConfirmed!==true) return {status:'blocked',reason:'TK 21/1 için adreste bulunmama/imtina ile haber kâğıdı ve teslim işlemleri ayrı ayrı doğrulanmalıdır.'};
      base=parseISO(input.postingDate); if(!base) return {status:'blocked',reason:'İhbarnamenin kapıya yapıştırıldığı tarih zorunlu.'};
      return {status:'ok',legalDate:iso(base),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:['TK 21/1: ayrı usul şartları doğrulandı; kapıya yapıştırma tarihi hukuki tebliğ tarihi alındı.']};
    }
    if(type==='tk21_2'){
      if(input.addressRegistryConfirmed!==true||input.noticeProcedureConfirmed!==true) return {status:'blocked',reason:'TK 21/2 için adres kayıt sistemi adresi ile haber kâğıdı ve teslim işlemleri ayrı ayrı doğrulanmalıdır.'};
      base=parseISO(input.postingDate); if(!base) return {status:'blocked',reason:'İhbarnamenin kapıya yapıştırıldığı tarih zorunlu.'};
      return {status:'ok',legalDate:iso(base),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:['TK 21/2: adres kayıt sistemi ve ayrı usul şartları doğrulandı; kapıya yapıştırma tarihi hukuki tebliğ tarihi alındı.']};
    }
    if(type==='irregular'){
      if(!input.knowledgeConfirmed) return {status:'blocked',reason:'Usulsüz tebligatta fiilî öğrenme tarihi doğrulanmadan kesin hesap yapılamaz.'};
      base=parseISO(input.knowledgeDate); if(!base) return {status:'blocked',reason:'Fiilî öğrenme tarihi zorunlu.'};
      return {status:'ok',legalDate:iso(base),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:['TK m.32: delille doğrulanmış fiilî öğrenme tarihi tebliğ tarihi olarak alındı.']};
    }
    if(type==='announcement'){
      base=parseISO(input.lastAnnouncementDate); if(!base) return {status:'blocked',reason:'Son ilan tarihi zorunlu.'};
      if(input.announcementDays===null||input.announcementDays===undefined||String(input.announcementDays).trim()==='') return {status:'blocked',reason:'İlanen tebligatta merci tarafından belirlenen 7–15 günlük süre açıkça girilmelidir.'};
      const n=Number(input.announcementDays);
      if(!Number.isInteger(n)||n<7||n>15) return {status:'blocked',reason:'İlanen tebligatta merci tarafından belirlenen süre 7–15 arasında tam sayı olmalı.'};
      const legal=addDays(base,n);
      return {status:'ok',legalDate:iso(legal),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:[`İlanen tebligat: merciin belirlediği ${n} gün uygulanarak tebliğ tarihi çözüldü.`]};
    }
    if(type==='abroad'){
      if(input.abroadMode==='tk25'){
        if(input.returnDocumentVerified!==true) return {status:'blocked',reason:'TK m.25 genel yurt dışı tebligatta dönüş belgesi doğrulanmalıdır.'};
        base=parseISO(input.actualDeliveryDate); if(!base) return {status:'blocked',reason:'Dönüş belgesindeki gerçek tebliğ tarihi zorunludur.'};
        return {status:'ok',legalDate:iso(base),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:['TK m.25: uygulanabilir ülke/sözleşme usulüne göre düzenlenmiş dönüş belgesindeki gerçek tebliğ tarihi alındı.']};
      }
      if(input.abroadMode==='tk25a'){
        if(input.turkishCitizenConfirmed!==true||input.consularNoticeConfirmed!==true) return {status:'blocked',reason:'TK m.25/a için Türk vatandaşlığı, dış temsilcilik bildirimi ve bildirimin adrese ulaştığı tarih doğrulanmalıdır.'};
        base=parseISO(input.noticeArrivalDate); if(!base) return {status:'blocked',reason:'Dış temsilcilik bildiriminin adrese ulaştığı tarih zorunludur.'};
        const limit=addDays(base,30);
        let legal,note;
        if(input.foreignDeliveryState==='not_applied'){
          legal=limit; note='TK m.25/a: temsilciliğe otuz gün içinde başvurulmadığı doğrulandı; tebligat otuzuncu günün bitiminde yapılmış sayıldı.';
        } else if(input.foreignDeliveryState==='accepted'){
          legal=parseISO(input.foreignActualServiceDate); note='TK m.25/a: temsilciliğe süresinde başvurulup evrakın fiilen alındığı tarih esas alındı.';
        } else if(input.foreignDeliveryState==='refused'){
          legal=parseISO(input.foreignRefusalRecordDate); note='TK m.25/a: temsilcilikte evrakı almaktan kaçınmaya ilişkin tutanak tarihi esas alındı.';
        } else return {status:'blocked',reason:'TK m.25/a için temsilciliğe başvuru ve evrakı alma/almaktan kaçınma durumu seçilmelidir.'};
        if(!legal) return {status:'blocked',reason:'TK m.25/a seçilen dalına ait fiilî teslim veya kaçınma tutanağı tarihi zorunludur.'};
        if(legal<base||legal>limit) return {status:'blocked',reason:'TK m.25/a fiilî teslim veya kaçınma tutanağı tarihi, bildirimin ulaşmasından önce veya otuz günlük başvuru penceresinden sonra olamaz.'};
        return {status:'ok',legalDate:iso(legal),eventResolved:true,recipientResolved:false,evidenceVerified:true,notes:[note]};
      }
      return {status:'blocked',reason:'Yurt dışı tebligatta TK m.25 veya m.25/a yolu seçilmelidir.'};
    }
    return {status:'blocked',reason:'Tebligat türü seçilmedi.'};
  }

  function resolveServiceRecipient(input={}){
    const schema=data.service_recipient_schema||{};
    const mode=(schema.modes||[]).find(x=>x.value===input.mode);
    if(!mode) return {status:'blocked',reason:'Temsil ve kişiye tebliğ bağlamı seçilmedi.'};
    if(!Array.isArray(input.events) || !input.events.length) return {status:'blocked',reason:'En az bir çözümlenmiş aday tebligat olayı gerekli.'};
    const allowedRoles=new Set((schema.event_roles||[]).map(x=>x.value));
    const events=[],seenEventIds=new Set(),seenFacts=new Set();
    for(const [index,event] of input.events.entries()){
      const legal=parseISO(event?.legalDate);
      const recipientId=String(event?.recipientId||'').trim();
      if(!event?.eventResolved || !legal || !['ok','conditional'].includes(event.status) || !allowedRoles.has(event.recipientRole) || !recipientId){
        return {status:'blocked',reason:`${index+1}. aday tebligat olayı eksik veya doğrulanmamış.`};
      }
      const eventId=String(event.eventId||`service-${index+1}`);
      const factKey=[event.recipientRole,recipientId,event.type,iso(legal)].join('|');
      if(seenEventIds.has(eventId)||seenFacts.has(factKey)) return {status:'blocked',reason:`${index+1}. aday tebligat olayı mükerrer.`};
      seenEventIds.add(eventId); seenFacts.add(factKey);
      events.push({...event,eventId,recipientId,legalDate:iso(legal)});
    }
    if(mode.requires_roster_complete && input.rosterComplete!==true){
      return {status:'blocked',reason:'Birden çok vekil ihtimali için vekil listesi ve bütün aday tebligat olaylarının eksiksiz olduğu doğrulanmalı.'};
    }
    if(mode.value==='unrepresented' && events.some(x=>x.recipientRole==='counsel')){
      return {status:'blocked',reason:'“Vekille takip edilmiyor” seçimi ile vekil tebligatı adayı çelişiyor.'};
    }
    if(String(input.regime||'').toUpperCase()==='CMK'&&mode.value==='represented'&&input.criminalProcedureRecipientConfirmed!==true){
      return {status:'blocked',reason:'Tebligat Kanunu m.11 CMK hükümlerini saklı tutar. CMK bakımından müdafi/vekil tebliğinin süre başlangıcı olduğu ayrıca doğrulanmalıdır.'};
    }
    const candidates=events.filter(x=>x.recipientRole===mode.selected_role).sort((a,b)=>a.legalDate.localeCompare(b.legalDate)||a.eventId.localeCompare(b.eventId));
    if(!candidates.length){
      const needed=mode.selected_role==='counsel'?'vekil':'asıl/kişisel muhatap';
      return {status:'blocked',reason:`Seçilen temsil dalı için geçerli bir ${needed} tebligatı bulunmuyor.`};
    }
    const selected=candidates[0];
    const notes=[];
    if(mode.value==='represented') notes.push('TK m.11: vekille takipte vekil olayları esas alındı; birden fazla vekil/olay içinde ilk geçerli hukuki tebliğ tarihi seçildi.');
    else if(mode.value==='personal_required') notes.push('Kişiye tebliğ zorunluluğu kullanıcı tarafından seçildi; asıl/kişisel muhatap olayları esas alındı.');
    else notes.push('Vekille takip edilmediği doğrulandığı için asıl muhatap olayları esas alındı.');
    if(candidates.length>1) notes.push(`${candidates.length} uygun aday arasından en erken geçerli tarih seçildi; sonraki tebligatlar süreyi yeniden başlatmadı.`);
    return {
      status:selected.status==='conditional'?'conditional':'ok',
      legalDate:selected.legalDate,
      recipientResolved:true,
      selectedEvent:selected,
      candidateEvents:candidates,
      mode:mode.value,
      source:schema.source,
      notes
    };
  }

  function booleanValue(value){
    if(value===true || value==='true') return true;
    if(value===false || value==='false') return false;
    return null;
  }

  function requiredInputKeys(rule){
    const keys=Array.isArray(rule?.required_inputs)
      ? rule.required_inputs.filter(key=>!AUTOMATIC_RECESS_INPUTS.has(key))
      : String(rule?.required_inputs||'').split(',').map(x=>x.trim()).filter(key=>key&&!AUTOMATIC_RECESS_INPUTS.has(key));
    for(const branch of (Array.isArray(rule?.audit?.branches)?rule.audit.branches:[])){
      if(branch?.status==='executable'){
        for(const key of (Array.isArray(branch.inputs)?branch.inputs:[])) if(!AUTOMATIC_RECESS_INPUTS.has(key)&&!keys.includes(key)) keys.push(key);
      }
    }
    if(keys.includes('submission_channel') && !keys.includes('channel_cutoff_confirmed')) keys.push('channel_cutoff_confirmed');
    return keys;
  }

  function normalizeInputValue(def,value){
    if(def.type==='boolean'){
      const normalized=booleanValue(value);
      return normalized===null?{present:false,value:null}:{present:true,value:normalized};
    }
    if(def.type==='date'){
      if(value===null || value===undefined || String(value).trim()==='') return {present:false,value:null};
      const parsed=parseISO(String(value));
      return parsed?{present:true,value:iso(parsed)}:{present:true,value:null,invalid:'Geçerli bir tarih girilmeli.'};
    }
    if(def.type==='number'){
      if(value===null||value===undefined||String(value).trim()==='') return {present:false,value:null};
      const n=Number(value);
      if(!Number.isFinite(n)) return {present:true,value:null,invalid:'Geçerli bir sayı girilmeli.'};
      if(def.integer&& !Number.isInteger(n)) return {present:true,value:null,invalid:'Tam sayı girilmeli.'};
      if(Number.isFinite(Number(def.min))&&n<Number(def.min)) return {present:true,value:null,invalid:`En az ${def.min} olmalı.`};
      if(Number.isFinite(Number(def.max))&&n>Number(def.max)) return {present:true,value:null,invalid:`En çok ${def.max} olmalı.`};
      return {present:true,value:n};
    }
    if(def.type==='select'){
      if(value===null || value===undefined || String(value).trim()==='') return {present:false,value:null};
      const normalized=String(value);
      const allowed=(def.options||[]).map(x=>String(x.value));
      return allowed.includes(normalized)?{present:true,value:normalized}:{present:true,value:null,invalid:'Listede yer alan bir değer seçilmeli.'};
    }
    if(def.type==='service_resolution'){
      if(!value || typeof value!=='object') return {present:false,value:null};
      const legal=parseISO(value.legalDate);
      if(!legal || value.status!=='ok' || value.recipientResolved!==true) return {present:true,value:null,invalid:'Tebligat çözücüden kesin, doğru muhatap/vekil bağlamı doğrulanmış hukuki tebliğ tarihi aktarılmalı; koşullu olay kesin son güne dönüştürülemez.'};
      return {present:true,value:{...value,legalDate:iso(legal)}};
    }
    if(def.type==='appeal_resolution'){
      if(!value||typeof value!=='object') return {present:false,value:null};
      if(value.status!=='yes'||value.resolved!==true) return {present:true,value:null,invalid:'Kanun yolu çözücüsünden bütün olguları doğrulanmış “açık” sonucu aktarılmalı.'};
      return {present:true,value:{...value}};
    }
    if(value===null || value===undefined || String(value).trim()==='') return {present:false,value:null};
    return {present:true,value:String(value).trim()};
  }

  function conditionMatches(condition,values,rule){
    if(!condition) return false;
    if(Array.isArray(condition.all)) return condition.all.every(item=>conditionMatches(item,values,rule));
    if(Array.isArray(condition.any)) return condition.any.some(item=>conditionMatches(item,values,rule));
    if(condition.rule_regime && String(rule?.regime||'').toUpperCase()!==String(condition.rule_regime).toUpperCase()) return false;
    const value=values[condition.field];
    if(Object.prototype.hasOwnProperty.call(condition,'equals')) return value===condition.equals;
    if(Object.prototype.hasOwnProperty.call(condition,'not_equals')) return value!==condition.not_equals;
    if(Array.isArray(condition.in)) return condition.in.includes(value);
    if(condition.present===true) return value!==undefined&&value!==null&&value!=='';
    return false;
  }

  function getRuleInputFields(rule){
    const schema=data.input_schema?.fields||{};
    return requiredInputKeys(rule).map(key=>{
      const override=rule?.input_overrides?.[key]||{};
      const field={key,...(schema[key]||{}),...override};
      // Ortak şemadaki `required:true`, yalnız belirli bir hukukî dalda gereken
      // alanı yanlışlıkla her dalda zorunlu hâle getirmemeli.
      if(Object.prototype.hasOwnProperty.call(override,'required_when') && !Object.prototype.hasOwnProperty.call(override,'required')) field.required=false;
      return field;
    });
  }

  function validateRuleInputs(rule,input={}){
    const fields=getRuleInputFields(rule), values={}, raw={};
    const unknown=fields.filter(f=>!f.type).map(f=>f.key);
    if(unknown.length) return {ok:false,values,missing:[],invalid:unknown.map(key=>({key,label:key,reason:'Veri şemasında alan tanımı yok.'}))};

    for(const field of fields){
      raw[field.key]=normalizeInputValue(field,input[field.key]);
      if(raw[field.key].present && !raw[field.key].invalid) values[field.key]=raw[field.key].value;
    }

    const missing=[], invalid=[];
    for(const field of fields){
      if(field.show_when&&!conditionMatches(field.show_when,values,rule)){delete values[field.key];continue;}
      const required=!!field.required || conditionMatches(field.required_when,values,rule);
      const normalized=raw[field.key];
      if(required && !normalized.present){
        missing.push({key:field.key,label:field.label||field.key});
        continue;
      }
      if(normalized.invalid){
        invalid.push({key:field.key,label:field.label||field.key,reason:normalized.invalid});
        continue;
      }
      if(normalized.present && Object.prototype.hasOwnProperty.call(field,'must_equal') && normalized.value!==field.must_equal){
        invalid.push({key:field.key,label:field.label||field.key,reason:'Bu güvenlik şartı doğrulanmadı.'});
      }
    }
    return {ok:missing.length===0 && invalid.length===0,values,missing,invalid,fields};
  }

  function resolveRuleStart(rule,values){
    const candidates=[];
    if(values.start_date) candidates.push({key:'start_date',date:values.start_date});
    if(values.electronic_address_arrival_date) candidates.push({key:'electronic_address_arrival_date',date:values.electronic_address_arrival_date});
    if(values.service_context?.legalDate) candidates.push({key:'service_context',date:values.service_context.legalDate});
    if(!candidates.length) return {ok:false,reason:'Hukuki başlangıç tarihi çözülemedi.'};
    const dates=[...new Set(candidates.map(x=>x.date))];
    if(dates.length!==1) return {ok:false,reason:'Birden fazla başlangıç girdisi farklı tarihler üretiyor; çelişki giderilmeden hesap yapılamaz.',candidates};
    if(rule.start_event_type==='service' && !values.service_context) return {ok:false,reason:'Bu kural tebligata bağlı; hukuki tebliğ tarihi tebligat çözücüden aktarılmalı.'};
    return {ok:true,date:parseISO(dates[0]),basis:candidates.map(x=>x.key)};
  }

  function finalizeDeadline(rule,date,input){
    const notes=[];
    const policy=ruleRecessPolicy(rule);
    const hmk103Exception=automaticHmk103Exception(rule,input);
    if(hmk103Exception) notes.push('Dosyanın seçilen işlem türü HMK m.103 kapsamında adli tatilde görüldüğünden HMK m.104 uzaması uygulanmadı.');
    const vr=applyRegimeVacation(date,rule.regime,{
      automaticApplicable:policy.applicable&&!hmk103Exception,
      hmk103Exception,
      periodStart:input.__period_start,
      duration:input.__duration,
      unit:input.__unit,
      saturdayWorking:input.__saturday_working===true
    });
    notes.push(...vr.notes);
    const fr=applyFinalHoliday(vr.date,{
      shift:!!rule.shift_last_day,
      holidayDirection:input.__holiday_direction||'forward',
      submissionChannel:input.submission_channel,
      channelCutoffConfirmed:input.channel_cutoff_confirmed===true,
      regime:rule.regime
    });
    if(fr.status==='blocked') return {...fr,nominalDate:iso(date)};
    notes.push(...fr.notes);
    return {status:'ok',date:fr.date,cutoff:fr.cutoff,notes};
  }

  function judicialExtension(rule,branch,input,base){
    const extensionStatus=input.extension_status;
    const maxNominal=addDuration(base.date,branch.max_duration,branch.max_unit);
    if(!maxNominal) return {status:'blocked',reason:'Ek sürenin kanuni üst sınırı motor tarafından çözülemedi.'};
    const maxFinal=finalizeDeadline(rule,maxNominal,input);
    if(maxFinal.status==='blocked') return maxFinal;
    const sourceNotes=[`Ek süre dalı: ${branch.summary}`,`Azami sınır: ${branch.max_duration} ${branch.max_unit}.`];

    if(extensionStatus==='not_requested'){
      return {status:'conditional',deadline:iso(base.date),cutoff:base.cutoff,baseDeadline:iso(base.date),notes:[...base.notes,'Ek süre talep edilmedi.',...sourceNotes]};
    }
    if(extensionStatus==='denied'){
      return {status:'conditional',deadline:iso(base.date),cutoff:base.cutoff,baseDeadline:iso(base.date),notes:[...base.notes,'Ek süre talebi reddedildi; asıl süre sonu esas alındı.',...sourceNotes]};
    }
    if(extensionStatus==='requested_pending'){
      return {
        status:'conditional',
        title:'Ek süre kararı bekleniyor',
        reason:'Tek bir kesin son gün üretilemez. Asıl süre sonu risk tarihi; azami tarih ise mahkemenin tam üst sınırdan ek süre vermesi ihtimalindeki dış sınırdır.',
        riskDeadline:iso(base.date),
        latestPossibleDeadline:iso(maxFinal.date),
        cutoff:maxFinal.cutoff,
        notes:[...base.notes,...maxFinal.notes,...sourceNotes]
      };
    }
    if(extensionStatus==='granted'){
      const ordered=parseISO(input.extension_deadline);
      if(!ordered) return {status:'blocked',reason:'Ek süre verildiyse mahkeme kararındaki son gün zorunludur.'};
      if(ordered<=base.date) return {status:'blocked',reason:'Verilen ek süre sonu, asıl süre sonundan sonra olmalıdır.',baseDeadline:iso(base.date)};
      const orderedFinal=finalizeDeadline(rule,ordered,input);
      if(orderedFinal.status==='blocked') return orderedFinal;
      if(orderedFinal.date>maxFinal.date){
        return {status:'blocked',reason:`Girilen ek süre sonu, ${fmtTR(maxFinal.date)} tarihli kanuni azami dış sınırı aşıyor. Mahkeme kararı ve başlangıç hesabı manuel incelenmeli.`,baseDeadline:iso(base.date),statutoryMaxDeadline:iso(maxFinal.date)};
      }
      return {
        status:'conditional',
        title:'Mahkemece verilen ek süre',
        deadline:iso(orderedFinal.date),
        cutoff:orderedFinal.cutoff,
        baseDeadline:iso(base.date),
        statutoryMaxDeadline:iso(maxFinal.date),
        notes:[...base.notes,...orderedFinal.notes,'Ek süre kararı ve bir defalık/süresinde talep koşulları kullanıcı girdileriyle doğrulandı.',...sourceNotes]
      };
    }
    return {status:'blocked',reason:'Ek süre dalının durumu seçilmedi.'};
  }

  function dateFromField(values,key){
    const value=values?.[key];
    if(typeof value==='string') return parseISO(value);
    if(value && typeof value==='object') return parseISO(value.legalDate||value.date);
    return null;
  }

  function dateOrderError(values){
    const start=dateFromField(values,'start_date');
    const absolute=dateFromField(values,'absolute_start_date')||dateFromField(values,'act_date');
    if(start&&absolute&&start<absolute) return 'Öğrenme/nispi süre başlangıcı, fiil veya mutlak süre başlangıcından önce olamaz.';
    return null;
  }

  function timelineEntry(rule,spec,values){
    if(spec.no_deadline) return {status:'ok',id:spec.id,label:spec.label,kind:'no_deadline',note:spec.note||'Bu dalda sabit kanuni son gün yok.',controls:!!spec.controls};
    const start=dateFromField(values,spec.start_field);
    if(!start) return {status:'blocked',reason:`${spec.label||spec.id}: başlangıç tarihi çözülemedi.`};
    let duration=spec.duration;
    if(spec.duration_field) duration=values[spec.duration_field];
    const signed=spec.direction==='backward'?-Number(duration):Number(duration);
    let nominal=spec.mode==='direct'?new Date(start):addDuration(start,signed,spec.unit,{saturdayWorking:values.saturday_working===true});
    if(!nominal) return {status:'blocked',reason:`${spec.label||spec.id}: süre birimi veya iş günü takvimi çözülemedi.`};
    if(spec.add_after){
      nominal=addDuration(nominal,Number(spec.add_after.duration),spec.add_after.unit,{saturdayWorking:values.saturday_working===true});
      if(!nominal) return {status:'blocked',reason:`${spec.label||spec.id}: ikinci süre kademesi çözülemedi.`};
    }
    let final={status:'ok',date:nominal,cutoff:null,notes:[]};
    if(spec.apply_final!==false){
      final=finalizeDeadline(rule,nominal,{
        ...values,
        __holiday_direction:spec.holiday_direction||'forward',
        __period_start:iso(start),
        __duration:signed,
        __unit:spec.unit,
        __saturday_working:values.saturday_working===true
      });
      if(final.status==='blocked') return final;
    }
    return {
      status:'ok',id:spec.id,label:spec.label,date:iso(final.date),nominalDate:iso(nominal),
      cutoff:final.cutoff,kind:spec.kind||'deadline',controls:!!spec.controls,
      notes:[...(final.notes||[]),...(spec.note?[spec.note]:[])]
    };
  }

  function resolveTimeline(rule,values){
    const calc=rule.calculation||{};
    if(calc.valid_from||calc.valid_to){
      const versionDate=dateFromField(values,calc.version_date_field||'start_date');
      if(!versionDate) return {status:'blocked',reason:'Tarihsel sürüm kapısı için olay tarihi çözülemedi.'};
      if(calc.valid_from&&versionDate<parseISO(calc.valid_from)) return {status:'blocked',reason:`Bu yürütülebilir kural yalnız ${fmtTR(calc.valid_from)} ve sonrası olaylar içindir; önceki metin ayrıca uygulanmalıdır.`};
      if(calc.valid_to&&versionDate>parseISO(calc.valid_to)) return {status:'blocked',reason:`Bu yürütülebilir kural yalnız ${fmtTR(calc.valid_to)} ve öncesi olaylar içindir; sonraki metin ayrıca uygulanmalıdır.`};
    }
    const relationError=dateOrderError(values);
    if(relationError) return {status:'blocked',reason:relationError};
    const specs=(calc.outputs||[]).filter(spec=>!spec.when||conditionMatches(spec.when,values,rule));
    if(!specs.length) return {status:'blocked',reason:'Seçilen hukukî dala karşılık gelen yürütülebilir çıktı bulunamadı.'};
    const deadlines=[];
    for(const spec of specs){
      const entry=timelineEntry(rule,spec,values);
      if(entry.status==='blocked') return entry;
      deadlines.push(entry);
    }
    const controlling=deadlines.filter(x=>x.controls&&x.date).sort((a,b)=>a.date.localeCompare(b.date));
    const output={status:'ok',title:'Hesaplanan hukukî zaman çizelgesi',deadlines,notes:deadlines.flatMap(x=>x.notes||[])};
    if(calc.primary_strategy==='earliest'&&controlling.length){
      output.deadline=controlling[0].date;
      output.cutoff=controlling[0].cutoff;
      output.primaryDeadlineId=controlling[0].id;
    } else if(calc.primary_strategy==='latest'&&controlling.length){
      const selected=controlling[controlling.length-1];
      output.deadline=selected.date; output.cutoff=selected.cutoff; output.primaryDeadlineId=selected.id;
    }
    if(deadlines.every(x=>x.kind==='no_deadline')){
      output.title='Sabit kanuni son gün yok';
      output.reason=deadlines.map(x=>x.note).filter(Boolean).join(' ');
    }
    return output;
  }

  function finalEntry(rule,values,id,label,date,extra={}){
    const final=extra.applyFinal===false?{status:'ok',date,cutoff:null,notes:[]}:
      finalizeDeadline(rule,date,{
        ...values,
        __holiday_direction:extra.holidayDirection||'forward',
        __period_start:extra.periodStart?iso(extra.periodStart):undefined,
        __duration:extra.duration,
        __unit:extra.unit,
        __saturday_working:values.saturday_working===true
      });
    if(final.status==='blocked') return final;
    return {status:'ok',id,label,date:iso(final.date),nominalDate:iso(date),cutoff:final.cutoff,kind:extra.kind||'deadline',controls:extra.controls!==false,notes:final.notes||[]};
  }

  function timelineResult(entries,strategy='earliest',title='Hesaplanan hukukî zaman çizelgesi'){
    const blocked=entries.find(x=>x.status==='blocked'); if(blocked) return blocked;
    const controlling=entries.filter(x=>x.controls&&x.date).sort((a,b)=>a.date.localeCompare(b.date));
    const out={status:'ok',title,deadlines:entries,notes:entries.flatMap(x=>x.notes||[])};
    if(controlling.length&&strategy!=='none'){
      const chosen=strategy==='latest'?controlling[controlling.length-1]:controlling[0];
      out.deadline=chosen.date; out.cutoff=chosen.cutoff; out.primaryDeadlineId=chosen.id;
    }
    return out;
  }

  function resolveUetsRule(rule,values){
    if(values.uets_evidence_verified!==true) return {status:'blocked',reason:'UETS delil kaydı doğrulanmadan tebliğ tarihi üretilemez.'};
    const arrival=dateFromField(values,'electronic_address_arrival_date');
    if(!arrival) return {status:'blocked',reason:'Elektronik adrese ulaşma tarihi zorunludur.'};
    const legal=addDays(arrival,5);
    return {status:'ok',title:'UETS hukukî tebliğ tarihi',legalDate:iso(legal),deadlines:[{status:'ok',id:'uets_service',label:'Tebliğ edilmiş sayılma tarihi',date:iso(legal),kind:'service_date',controls:false,notes:['Ulaşma günü sayılmadan izleyen beşinci günün sonunda tebliğ edilmiş sayıldı; tatil kaydırması uygulanmadı.']}],notes:['UETS beşinci gün kuralı bir süre sonu değil, tebliğ edilmiş sayılma olayıdır.']};
  }

  function iyukWaitPolicy(date){
    return date<parseISO('2021-07-14')?{replyDays:60,maxMonths:6,label:'14.07.2021 öncesi metin'}:{replyDays:30,maxMonths:4,label:'14.07.2021 ve sonrası metin'};
  }

  function resolveIyuk10(rule,values){
    const application=dateFromField(values,'application_date'), response=dateFromField(values,'response_date'), finalResponse=dateFromField(values,'final_response_date');
    const policy=iyukWaitPolicy(application), period=Number(values.lawsuit_period_days);
    const implied=addDays(application,policy.replyDays), maxWait=addMonthsClamped(application,policy.maxMonths);
    const entries=[{status:'ok',id:'reply_window',label:'Cevapsızlık/zımni ret eşiği',date:iso(implied),nominalDate:iso(implied),kind:'milestone',controls:false,notes:[policy.label]}];
    let base;
    if(values.branch_choice==='no_response') base=implied;
    else if(values.branch_choice==='final_response'){
      if(!response||response<application||response>implied) return {status:'blocked',reason:'“Süresinde kesin cevap” dalında cevap tarihi başvuru ile zımni ret eşiği arasında olmalıdır.'};
      base=response;
    } else if(values.branch_choice==='late_response'){
      if(!response||response<=implied) return {status:'blocked',reason:'“Geç cevap” tarihi zımni ret eşiğinden sonra olmalıdır.'};
      entries.push(finalEntry(rule,values,'late_response_action','Geç cevaptan sonra dava son günü',addDays(response,60)));
      return {...timelineResult(entries,'earliest','İYUK m.10 geç cevap dalı'),notes:[policy.label,'Geç cevaba karşı kanundaki özel 60 günlük süre uygulandı.']};
    } else if(['nonfinal_response','nonfinal_waiting','nonfinal_reject'].includes(values.branch_choice)){
      if(!response||response<application||response>implied) return {status:'blocked',reason:'Kesin olmayan cevabın kanuni cevap süresi içinde verilmiş olması gerekir.'};
      if(values.branch_choice==='nonfinal_response'&&(!finalResponse||finalResponse<response)) return {status:'blocked',reason:'Kesin cevap tarihi, kesin olmayan cevap tarihinden önce olamaz.'};
      entries.push({status:'ok',id:'max_wait',label:'Azami bekleme sonu',date:iso(maxWait),nominalDate:iso(maxWait),kind:'risk_milestone',controls:false,notes:[`Başvurudan itibaren azami ${policy.maxMonths} ay bekleme.`]});
      base=values.branch_choice==='nonfinal_reject'?response:values.branch_choice==='nonfinal_waiting'?maxWait:(finalResponse<=maxWait?finalResponse:maxWait);
      if(values.branch_choice==='nonfinal_response'&&finalResponse>maxWait) entries.push(finalEntry(rule,values,'late_final_response','Azami bekleme sonrası cevaba karşı özel dava son günü',addDays(finalResponse,60),{controls:false}));
    } else return {status:'blocked',reason:'İYUK m.10 cevap dalı seçilmedi.'};
    entries.push(finalEntry(rule,values,'lawsuit_deadline','Dava açma son günü',addDays(base,period)));
    const out=timelineResult(entries,'earliest','İYUK m.10 başvuru ve dava süresi');
    out.notes=[...(out.notes||[]),policy.label];
    return out;
  }

  function resolveIyuk11(rule,values){
    const original=dateFromField(values,'original_start_date'), application=dateFromField(values,'application_date'), response=dateFromField(values,'response_date');
    const total=Number(values.original_period_days);
    if(application<original) return {status:'blocked',reason:'İdari başvuru tarihi asıl dava süresi başlangıcından önce olamaz.'};
    const originalFinal=finalizeDeadline(rule,addDays(original,total),values);
    if(originalFinal.status==='blocked') return originalFinal;
    if(application>originalFinal.date) return {status:'blocked',title:'Başvuru süresi geçmiş',reason:'İdari başvuru, tatil uzaması dahil asıl dava süresi sonundan sonra yapılmış.',baseDeadline:iso(originalFinal.date)};
    const elapsed=Math.floor((application-original)/MS_DAY);
    const remaining=total-elapsed;
    if(remaining<=0) return {status:'conditional',title:'Başvuru asıl dava süresi içinde',baseDeadline:iso(originalFinal.date),elapsedDays:elapsed,reason:'Başvuru nominal son günde veya tatille uzayan aralıkta. Geç başvuru sayılmadı. Ret sonrası kalan gün sayısı bu özel durum için ayrıca içtihatla belirlenmeli; kesin dava son günü üretilmedi.',notes:originalFinal.notes};
    const policy=iyukWaitPolicy(application), implied=addDays(application,policy.replyDays);
    let resume=implied;
    if(values.branch_choice==='express_rejection'){
      if(!response||response<application||response>implied) return {status:'blocked',reason:'Açık ret/cevap tarihi başvuru ile zımni ret eşiği arasında olmalıdır.'};
      resume=response;
    } else if(values.branch_choice!=='no_response') return {status:'blocked',reason:'İYUK m.11 cevap dalı seçilmedi.'};
    const end=finalEntry(rule,values,'remaining_lawsuit','Kalan dava süresinin son günü',addDays(resume,remaining));
    const out=timelineResult([{status:'ok',id:'suspension_end',label:'Duran sürenin yeniden işlemeye başladığı olay',date:iso(resume),nominalDate:iso(resume),kind:'milestone',controls:false,notes:[]},end]);
    out.elapsedDays=elapsed; out.remainingDays=remaining; out.notes=[...(out.notes||[]),policy.label,`Başvurudan önce geçen ${elapsed} gün düşüldü; ${remaining} gün kaldı.`];
    return out;
  }


  function resolveTbk72(rule,values){
    const learned=dateFromField(values,'start_date'), act=dateFromField(values,'act_date');
    if(learned<act) return {status:'blocked',reason:'Zarar ve sorumlunun öğrenildiği tarih haksız fiil tarihinden önce olamaz.'};
    if(values.criminal_rule_applicable===true){
      return {status:'blocked',reason:'TBK m.72 uzamış ceza zamanaşımı dalı; ceza süresinin olağan iki/on yıllık sürelerle ilişkisi, öğrenme anı ve ceza zamanaşımının durma/kesilme olayları somut dosya ve içtihatla teyit edilmeden otomatik son gün üretmez.'};
    }
    return timelineResult([
      finalEntry(rule,values,'relative','İki yıllık nispi zamanaşımı',addYearsClamped(learned,2)),
      finalEntry(rule,values,'absolute','Fiilden itibaren on yıllık mutlak zamanaşımı',addYearsClamped(act,10))
    ]);
  }

  function resolveKtk97(rule,values){
    const application=dateFromField(values,'application_date'), response=dateFromField(values,'response_date');
    const windowEnd=addDays(application,15);
    const entries=[{status:'ok',id:'insurer_window',label:'Sigortacının 15 günlük cevap penceresi sonu',date:iso(windowEnd),nominalDate:iso(windowEnd),kind:'institutional_deadline',controls:false,notes:[]}];
    let earliest;
    if(values.branch_choice==='no_response') earliest=addDays(windowEnd,1);
    else if(values.branch_choice==='inadequate_response'){
      if(!response||response<application) return {status:'blocked',reason:'Yetersiz cevap tarihi başvuru tarihinden önce olamaz.'};
      earliest=response<=windowEnd?response:addDays(windowEnd,1);
    } else return {status:'blocked',reason:'Sigortacının cevap durumu seçilmedi.'};
    entries.push(finalEntry(rule,values,'earliest_action','Dava/tahkime başvurulabilecek en erken güvenli gün',earliest,{kind:'earliest_action'}));
    return timelineResult(entries,'earliest','KTK m.97 ön başvuru penceresi');
  }

  function resolveIik134(rule,values){
    const auction=dateFromField(values,'auction_date');
    if(values.branch_choice==='cure'){
      const application=dateFromField(values,'application_date'), notice=dateFromField(values,'cure_notice_date');
      if(application<parseISO('2025-12-25')) return {status:'blocked',reason:'İki haftalık tamamlama dalı 25.12.2025 öncesi başvurulara uygulanmaz; eski metin ayrıca incelenmelidir.'};
      return timelineResult([finalEntry(rule,values,'cure','Eksik harç/teminatı tamamlama son günü',addDuration(notice,2,'week'))]);
    }
    if(!auction) return {status:'blocked',reason:'İhale tarihi zorunludur.'};
    const portalAnnouncement=dateFromField(values,'portal_announcement_date');
    if(!portalAnnouncement) return {status:'blocked',reason:'İhalenin yapıldığına ilişkin kararın elektronik satış portalında ilan tarihi zorunludur.'};
    if(portalAnnouncement<auction) return {status:'blocked',reason:'Elektronik satış portalındaki ihale kararı ilan tarihi ihale tarihinden önce olamaz.'};
    const absolute=finalEntry(rule,values,'absolute','Elektronik satış portalındaki ihale kararı ilanından itibaren bir yıllık mutlak sınır',addYearsClamped(portalAnnouncement,1));
    if(values.branch_choice==='known_at_auction') return timelineResult([finalEntry(rule,values,'relative','İhalenin feshi istemi son günü',addDays(auction,7)),absolute]);
    if(values.branch_choice==='learned_later'){
      const learned=dateFromField(values,'start_date');
      if(learned<auction) return {status:'blocked',reason:'Sonradan öğrenme tarihi ihale tarihinden önce olamaz.'};
      return timelineResult([finalEntry(rule,values,'relative','Öğrenmeden itibaren fesih istemi son günü',addDays(learned,7)),absolute]);
    }
    return {status:'blocked',reason:'İhalenin feshi dalı seçilmedi.'};
  }

  function resolveIik106(rule,values){
    const seizure=dateFromField(values,'start_date'), suspended=Number(values.suspension_days||0);
    const firstNominal=addDays(addYearsClamped(seizure,1),suspended);
    const first=finalEntry(rule,values,'first_sale_request','İlk satış isteme süresinin son günü',firstNominal);
    if(values.sale_request_state==='not_requested') return timelineResult([first]);
    if(values.sale_costs_complete!==true) return {status:'blocked',reason:'Süresinde satış istemi dalında satış giderlerinin tam ve zamanında yatırıldığı doğrulanmalıdır.'};
    if(values.sale_request_state==='requested_pending') return {status:'ok',title:'Satış sonucu bekleniyor',deadlines:[first],notes:['İlk istemin süresinde ve giderlerin tam olduğu doğrulandı; ikinci süre ancak satış talebiyle satış gerçekleşmezse doğar.']};
    if(values.sale_request_state==='sale_failed'){
      const second=finalEntry(rule,values,'second_sale_request','Satış gerçekleşmemesi sonrası uzatılmış satış isteme son günü',addYearsClamped(firstNominal,1));
      return timelineResult([first,second],'none','İİK m.106 iki kademeli satış isteme süresi');
    }
    return {status:'blocked',reason:'Satış talebinin durumu seçilmedi.'};
  }

  function resolveForeignService(rule,values){
    const start=dateFromField(values,'start_date');
    if(values.foreign_service_mode==='tk25'){
      if(values.foreign_return_verified!==true) return {status:'blocked',reason:'TK m.25 için uygulanabilir ülke/sözleşme usulündeki dönüş belgesi doğrulanmalıdır.'};
      return {status:'ok',title:'Yurt dışı hukukî tebliğ tarihi',legalDate:iso(start),deadlines:[{status:'ok',id:'foreign_service',label:'Dönüş belgesindeki gerçek tebliğ tarihi',date:iso(start),kind:'service_date',controls:false,notes:[]}]};
    }
    if(values.foreign_service_mode==='tk25a'){
      if(values.turkish_citizen_confirmed!==true||values.consular_notice_confirmed!==true) return {status:'blocked',reason:'TK m.25/a için Türk vatandaşlığı ile dış temsilcilik bildirimi ve adrese ulaşma olayı doğrulanmalıdır.'};
      const limit=addDays(start,30);
      let legal,label,note;
      if(values.foreign_delivery_state==='not_applied'){
        legal=limit; label='Başvurulmaması nedeniyle tebliğ edilmiş sayılma tarihi'; note='Bildirimin adrese ulaştığı tarihten itibaren otuzuncu günün bitimi alındı.';
      } else if(values.foreign_delivery_state==='accepted'){
        legal=dateFromField(values,'foreign_actual_service_date'); label='Tebliğ evrakının fiilen alındığı tarih'; note='Muhatap temsilciliğe başvurup evrakı aldığı için fiilî teslim tarihi alındı.';
      } else if(values.foreign_delivery_state==='refused'){
        legal=dateFromField(values,'foreign_refusal_record_date'); label='Tebellüğden kaçınma tutanağı tarihi'; note='Muhatap temsilciliğe başvurup evrakı almaktan kaçındığı için tutanak tarihi alındı.';
      } else return {status:'blocked',reason:'TK m.25/a için temsilciliğe başvuru ve evrakı alma/almaktan kaçınma durumu seçilmelidir.'};
      if(!legal) return {status:'blocked',reason:`${label} zorunludur.`};
      if(legal<start||legal>limit) return {status:'blocked',reason:'TK m.25/a fiilî teslim veya kaçınma tutanağı tarihi, bildirimin ulaşmasından önce veya otuz günlük başvuru penceresinden sonra olamaz.'};
      return {status:'ok',title:'TK m.25/a hukukî tebliğ tarihi',legalDate:iso(legal),deadlines:[{status:'ok',id:'foreign_service_25a',label,date:iso(legal),kind:'service_date',controls:false,notes:[note]}]};
    }
    return {status:'blocked',reason:'Yurt dışı tebligat yolu seçilmedi.'};
  }

  function resolveAym(rule,values){
    const start=dateFromField(values,'start_date');
    if(values.branch_choice==='ordinary') return timelineResult([finalEntry(rule,values,'ordinary','Bireysel başvuru son günü',addDays(start,30))]);
    if(values.branch_choice==='excuse') return timelineResult([finalEntry(rule,values,'excuse','Haklı mazeret sonrası başvuru son günü',addDays(start,15))]);
    if(values.branch_choice==='deficiency') return timelineResult([finalEntry(rule,values,'deficiency','Eksikliği tamamlama son günü',addDays(start,Number(values.authority_set_days)))]);
    return {status:'blocked',reason:'AYM başvuru dalı seçilmedi.'};
  }

  function resolveHmkRetrial(rule,values){
    if(values.branch_choice==='conflicting_judgments'){
      const cap=dateFromField(values,'judgment_limitation_end_date');
      return timelineResult([finalEntry(rule,values,'judgment_period','Aykırı kesin hükümler dalında ilama ilişkin zamanaşımı süresi',cap)]);
    }
    const start=dateFromField(values,'start_date');
    const relative=finalEntry(rule,values,'relative','Sebebe göre üç aylık iade süresi',addMonthsClamped(start,3));
    if(values.branch_choice==='echr'){
      relative.notes=[...(relative.notes||[]),'AİHM ihlali dalındaki on yıllık üst sınır hükmü AYM tarafından iptal edildi; bu dalda otomatik on yıllık tavan uygulanmadı.'];
      return timelineResult([relative]);
    }
    if(values.branch_choice==='general'){
      const finality=dateFromField(values,'judgment_final_date');
      return timelineResult([relative,finalEntry(rule,values,'absolute','Hükmün kesinleşmesinden itibaren on yıllık üst sınır',addYearsClamped(finality,10))]);
    }
    return {status:'blocked',reason:'Yargılamanın iadesi sebebi seçilmedi.'};
  }

  function noDeadline(id,label,note){ return {status:'ok',title:'Sabit kanuni son gün yok',reason:note,deadlines:[{status:'ok',id,label,kind:'no_deadline',controls:false,note}]}; }

  function resolveCmk308(rule,values){
    if(values.branch_choice==='favorable') return noDeadline('favorable','Sanık lehine itiraz','Sanık lehine itirazda süre aranmaz.');
    if(values.branch_choice==='excluded') return {status:'na',title:'CMK m.308 itirazı uygulanmaz',reason:'Yargı yeri belirleme veya görevsizlik kararı bu itiraz yolunun kapsamı dışındadır.'};
    if(values.branch_choice!=='adverse') return {status:'blocked',reason:'CMK m.308 dalı seçilmedi.'};
    const delivery=dateFromField(values,'start_date');
    if(iso(delivery)==='2026-07-31') return {status:'blocked',reason:'31.07.2026 tarihli teslim için yürürlük anı/gün içi sıralama tarih alanından belirlenemiyor; teslim belgesi ve geçiş hükmü dosyadan teyit edilmelidir.'};
    const current=delivery>parseISO('2026-07-31');
    const decision=dateFromField(values,'decision_date');
    if(decision>delivery) return {status:'blocked',reason:'İtiraza konu karar tarihi, dosyanın Yargıtay Cumhuriyet Başsavcılığına teslim tarihinden sonra olamaz.'};
    const pre7499=!current&&decision<parseISO('2024-06-01');
    const nominal=current?addDuration(delivery,3,'month'):addDuration(delivery,pre7499?30:1,pre7499?'day':'month');
    const duration=current?3:(pre7499?30:1), unit=current?'month':(pre7499?'day':'month');
    const out=timelineResult([finalEntry(rule,values,'adverse','Sanık aleyhine başsavcılık itirazı son günü',nominal,{periodStart:delivery,duration,unit})]);
    out.notes=[...(out.notes||[]),current?'7589 sonrası üç aylık metin uygulandı.':pre7499?'01.06.2024 öncesi karar için otuz günlük eski metin uygulandı.':'7499 sonrası ve 7589 öncesi bir aylık metin uygulandı.'];
    return out;
  }

  function resolveCmk308a(rule,values){
    if(values.branch_choice==='favorable') return noDeadline('favorable','Sanık lehine itiraz','Sanık lehine itirazda süre aranmaz.');
    const start=dateFromField(values,'start_date');
    const decision=dateFromField(values,'decision_date');
    if(decision>start) return {status:'blocked',reason:'BAM karar tarihi, başsavcılığa verilme veya itirazın tebliğ tarihinden sonra olamaz.'};
    if(values.branch_choice==='response'){
      const current=decision>=parseISO('2024-06-01');
      const duration=current?2:7, unit=current?'week':'day';
      const out=timelineResult([finalEntry(rule,values,'response','Aleyhe itiraza cevap son günü',addDuration(start,duration,unit),{periodStart:start,duration,unit})]);
      out.notes=[...(out.notes||[]),current?'01.06.2024 ve sonrası karar için iki haftalık cevap süresi uygulandı.':'01.06.2024 öncesi karar için yedi günlük eski cevap süresi uygulandı.'];
      return out;
    }
    if(values.branch_choice==='adverse'){
      const current=decision>=parseISO('2024-06-01');
      const nominal=addDuration(start,current?1:30,current?'month':'day');
      const duration=current?1:30, unit=current?'month':'day';
      const out=timelineResult([finalEntry(rule,values,'adverse','BAM Cumhuriyet başsavcılığı itirazı son günü',nominal,{periodStart:start,duration,unit})]);
      out.notes=[...(out.notes||[]),current?'01.06.2024 ve sonrası karar için bir aylık metin uygulandı.':'01.06.2024 öncesi karar için otuz günlük eski metin uygulandı.'];
      return out;
    }
    return {status:'blocked',reason:'CMK m.308/A dalı seçilmedi.'};
  }

  function deadlineFromService(rule,values,duration,unit,label,notes=[]){
    const start=dateFromField(values,'service_context');
    if(!start) return {status:'blocked',reason:'Hukukî tebliğ tarihi tebligat çözücüden alınamadı.'};
    const decision=dateFromField(values,'decision_date');
    if(decision&&start<decision) return {status:'blocked',reason:'Tebliğ tarihi karar tarihinden önce olamaz.'};
    const nominal=addDuration(start,duration,unit);
    if(!nominal) return {status:'blocked',reason:'Kanun yolu süresi hesaplanamadı.'};
    const output=timelineResult([
      finalEntry(rule,values,'remedy_deadline',label,nominal,{periodStart:start,duration,unit})
    ]);
    output.notes=[...(output.notes||[]),...notes];
    return output;
  }

  function thresholdReferenceMeta(set){
    return {
      regime:set.regime,
      event:set.referenceEvent,
      label:set.referenceLabel,
      date:set.referenceDate,
      year:set.year,
      basis:set.basis,
      source:set.source
    };
  }

  function resolveHmkAppeal(rule,values){
    const decision=dateFromField(values,'decision_date');
    const lawsuit=dateFromField(values,'lawsuit_date');
    if(lawsuit>decision) return {status:'blocked',reason:'Dava tarihi karar tarihinden sonra olamaz.'};
    if(decision<parseISO('2025-06-04')) return {status:'blocked',reason:'04.06.2025 öncesi HMK m.341 metni ve geçiş rejimi bu sürümde doğrulanmadı; güncel parasal sınır geriye yürütülmez.'};
    if(values.decision_kind==='other') return {status:'no',title:'Bu karar için istinaf yolu gösterilemedi',reason:'Seçilen karar türü HMK m.341’de otomatik olarak istinafa açık sayılan kararlar arasında değil.'};

    const directlyOpen=['non_monetary','moral_damage','expropriation'].includes(values.hmk_case_type);
    let reason='Karar türü HMK m.341 kapsamındadır.';
    let thresholdReference;
    if(!directlyOpen){
      if(values.principal_amounts_confirmed!==true) return {status:'blocked',reason:'Faiz, yargılama gideri ve vekâlet ücreti ayrıştırılarak yalnız asıl talep tutarlarının girildiği doğrulanmalıdır.'};
      const amountSued=nonNegativeNumber(values.amount_sued);
      const awarded=nonNegativeNumber(values.awarded_amount);
      const total=nonNegativeNumber(values.total_claim_amount);
      if(amountSued===null||awarded===null||awarded>amountSued) return {status:'blocked',reason:'Dava edilen ve hükmedilen asıl talep tutarları geçerli olmalı; hükmedilen tutar dava edilen tutarı aşmamalıdır.'};
      if(values.party_position==='plaintiff'&&values.claim_mode==='partial'&&(total===null||total<amountSued)) return {status:'blocked',reason:'Kısmi davada alacağın tamamı, dava edilen kısımdan az olamaz.'};
      if(values.party_position==='plaintiff'&&amountSued===awarded) return {status:'blocked',reason:'Asıl talep tamamen kabul edilmiş. Başvuruya konu aleyhe bölüm belirlenmeden istinaf tarihi hesaplanamaz.'};
      let disputed;
      if(values.party_position==='plaintiff') disputed=values.claim_mode==='partial'?total:amountSued-awarded;
      else if(values.party_position==='defendant') disputed=awarded;
      else return {status:'blocked',reason:'Parasal kesinlik sınırının hangi taraf bakımından hesaplanacağı seçilmelidir.'};
      const set=thresholdForCase('HMK','İstinaf',{lawsuitDate:values.lawsuit_date});
      if(set.status!=='resolved') return set;
      thresholdReference=thresholdReferenceMeta(set);
      if(disputed<=set.threshold){
        return {status:'no',title:'Parasal sınır nedeniyle istinaf yolu kapalı',reason:`Bu taraf bakımından çekişmeli asıl talep ${money(disputed)}; dava tarihi yılı HMK istinaf sınırı ${money(set.threshold)} ve kanun sınırı geçmeyen kararları kesin sayıyor.`,disputedAmount:disputed,threshold:set.threshold,thresholdReference};
      }
      reason=`Bu taraf bakımından çekişmeli asıl talep ${money(disputed)}, ${money(set.threshold)} istinaf sınırını aşıyor.`;
    } else if(values.hmk_case_type==='moral_damage') reason='Manevî tazminat kararlarında miktara bakılmaksızın istinaf yolu açıktır.';
    else if(values.hmk_case_type==='expropriation') reason='Kamulaştırma bedel tespiti uyuşmazlığında parasal istinaf kesinlik engeli uygulanmadı.';

    const output=deadlineFromService(rule,values,2,'week','HMK istinaf başvurusunun son günü',[reason,'Süre, usulüne uygun hukukî tebliğ tarihini izleyen gün başlatılarak iki hafta olarak hesaplandı.']);
    if(thresholdReference) output.thresholdReference=thresholdReference;
    return output;
  }

  function resolveHmkCassation(rule,values){
    const decision=dateFromField(values,'decision_date');
    const lawsuit=dateFromField(values,'lawsuit_date');
    const serviceDate=dateFromField(values,'service_context');
    if(lawsuit>decision) return {status:'blocked',reason:'Dava tarihi BAM karar tarihinden sonra olamaz.'};
    if(values.hmk362_exclusion!=='none') return {status:'no',title:'HMK m.362 kesinlik sebebi',reason:'Seçilen karar türü HMK m.362/1 kapsamındaki temyiz edilemeyen karar gruplarındadır.'};
    if(decision<parseISO('2025-06-04')) return {status:'blocked',reason:'04.06.2025 öncesi parasal sınır ve geçiş metni doğrulanmadan güncel HMK temyiz rejimi uygulanamaz.'};

    if(values.hmk_case_type==='non_monetary') return deadlineFromService(rule,values,2,'week','Temyiz başvurusunun son günü',['Parayla ölçülemeyen dava için parasal sınır aranmadı; diğer kesinlik nedenleri ayrıca değerlendirildi.']);
    const set=thresholdForCase('HMK','Temyiz',{lawsuitDate:values.lawsuit_date});
    if(set.status!=='resolved') return set;
    const appeal=threshold('HMK','İstinaf',set.year);
    if(appeal===null) return {status:'blocked',reason:`${set.year} yılı HMK istinaf sınırı veri setinde yok; HMK m.362/3 hesabı yapılamaz.`};
    const thresholdReference=thresholdReferenceMeta(set);
    const bam=nonNegativeNumber(values.bam_value);
    if(bam===null) return {status:'blocked',reason:'BAM hükmünün asıl talep değeri girilmelidir.'};

    let routeReason;
    if(values.hmk_case_type==='expropriation'&&decision>=parseISO('2026-10-20')){
      routeReason='Kamulaştırma bedel tespiti kararlarında temyiz parasal engelini kaldıran AYM iptal hükmünün yürürlük tarihi geçti.';
    } else if(values.bam_outcome==='rejected'){
      if(bam<=set.threshold) return {status:'no',title:'Parasal sınır nedeniyle temyiz yolu kapalı',reason:`BAM hüküm değeri ${money(bam)}; dava tarihi yılı genel temyiz sınırı ${money(set.threshold)} ve sınırı geçmiyor.`,threshold:set.threshold,thresholdReference};
      routeReason=`BAM hüküm değeri ${money(set.threshold)} genel temyiz sınırını aşıyor.`;
    } else if(values.bam_outcome==='accepted_redecided'){
      if(decision>=parseISO('2026-07-31')){
        const part=nonNegativeNumber(values.accepted_rejected_amount);
        const first=nonNegativeNumber(values.first_value);
        if(part===null||first===null) return {status:'blocked',reason:'HMK m.362/3 için kabul/ret edilen kısım ve ilk derece hüküm değeri birlikte girilmelidir.'};
        const diff=Math.abs(bam-first);
        if(part<=appeal) return {status:'no',title:'HMK m.362/3 parasal engeli',reason:`Kabul veya ret edilen kısım ${money(part)}; ${money(appeal)} istinaf sınırını geçmiyor.`,threshold:appeal,thresholdReference,diff};
        if(bam===set.threshold) return {status:'blocked',reason:'BAM hüküm değeri genel temyiz sınırına tam eşit. HMK m.362/1 ile yeni m.362/3 ilişkisindeki eşitlik dosyadan teyit edilmeden tarih üretilmez.',thresholdReference,diff};
        if(bam<set.threshold&&diff<=appeal) return {status:'no',title:'HMK m.362/3 fark engeli',reason:`BAM değeri genel temyiz sınırının altında ve ilk derece–BAM farkı ${money(diff)} ile ${money(appeal)} istinaf sınırını geçmiyor.`,thresholdReference,diff};
        if(bam<set.threshold&&values.costs_only===true) return {status:'no',title:'Yalnız gider/vekâlet ücreti',reason:'Genel temyiz sınırının altındaki BAM kararı yalnız yargılama gideri veya vekâlet ücretine ilişkin.',thresholdReference,diff};
        routeReason=`HMK m.362/3 uygulandı: kabul/ret kısmı ${money(appeal)} sınırını aşıyor ve fark/gider istisnası yolu kapatmıyor.`;
      } else if(decision>=parseISO('2026-05-21')){
        const pendingFinal=serviceDate?finalizeDeadline(rule,addDuration(serviceDate,2,'week'),values):null;
        const pendingEnd=pendingFinal?.status==='ok'?pendingFinal.date:null;
        if(!serviceDate||!pendingEnd||serviceDate>=parseISO('2026-07-31')||pendingEnd>=parseISO('2026-07-31')){
          return {status:'blocked',reason:'BAM kararı 21.05.2026–30.07.2026 AYM döneminde olsa da başvuru penceresi 31.07.2026 tarihli 7589 değişikliğine taşıyor. Açık HMK geçiş hükmü bulunmadığından somut dosya teyidi gerekir.'};
        }
        routeReason='21.05.2026 tarihli AYM iptalinden sonra ve 7589 değişikliğinden önce BAM’ın kabul ederek yeniden esas hakkında verdiği karar için miktar engeli uygulanmadı.';
      } else {
        if(bam<=set.threshold) return {status:'no',title:'Parasal sınır nedeniyle temyiz yolu kapalı',reason:`AYM iptali öncesi dönemde BAM hüküm değeri ${money(set.threshold)} genel temyiz sınırını geçmiyor.`,thresholdReference};
        routeReason='AYM iptali öncesi genel HMK temyiz sınırı aşılıyor.';
      }
    } else return {status:'blocked',reason:'BAM’ın başvuruyu esastan reddettiği veya kabul edip yeniden esas hakkında karar verdiği seçilmelidir.'};

    const output=deadlineFromService(rule,values,2,'week','HMK temyiz başvurusunun son günü',[routeReason,'Süre, BAM kararının usulüne uygun hukukî tebliğinden itibaren iki haftadır.']);
    output.thresholdReference=thresholdReference;
    return output;
  }

  function resolveIyukAppeal(rule,values){
    if(values.iyuk_route==='iyuk20a') return {status:'na',title:'İstinaf yolu yok',reason:'İYUK m.20/A ivedi yargılama usulünde istinaf atlanır; karar tebliğinden itibaren 15 günlük doğrudan temyiz yolu ayrıca hesaplanmalıdır.'};
    if(values.iyuk_route==='iyuk20b') return {status:'na',title:'İstinaf yolu yok',reason:'İYUK m.20/B merkezî ve ortak sınav usulünde istinaf atlanır; karar tebliğinden itibaren 5 günlük doğrudan temyiz yolu ayrıca hesaplanmalıdır.'};
    if(values.iyuk_route==='special_unknown') return {status:'blocked',reason:'Özel kanun/özel süre ihtimali işaretlendi. Özel hüküm teyit edilmeden genel 30 günlük İYUK süresi uygulanamaz.'};
    if(values.iyuk_route==='earthquake15') return {status:'conditional',reason:'Deprem hasar tespiti davasında geçici hükmün kapsamı ve uygulanacağı dönem dosyadan incelenmelidir. Bu inceleme olmadan kesin son gün gösterilemez.'};
    if(values.iyuk_route==='rejection7') return deadlineFromService(rule,values,7,'day','İYUK m.48/7 itiraz/istinaf son günü',['Başvurunun reddine ilişkin özel yedi günlük kanun yolu süresi uygulandı.']);
    if(values.iyuk_route!=='ordinary') return {status:'blocked',reason:'İdarî kanun yolu rotası seçilmedi.'};
    if(values.special_route_checked!==true) return {status:'blocked',reason:'İYUK m.20/A, m.20/B ve diğer özel sürelerin dosyada bulunmadığı doğrulanmalıdır.'};

    const decision=dateFromField(values,'decision_date');
    const lawsuit=dateFromField(values,'lawsuit_date');
    if(lawsuit>decision) return {status:'blocked',reason:'Dava tarihi karar tarihinden sonra olamaz.'};
    if(decision<parseISO('2025-06-04')) return {status:'blocked',reason:'04.06.2025 öncesi İYUK m.45 metni ve geçiş rejimi doğrulanmadan güncel sınır uygulanamaz.'};
    let routeReason='Parasal kesinlik engeli bulunmayan olağan İYUK istinaf yolu uygulandı.';
    let thresholdReference;
    if(values.iyuk_case_value_type==='monetary'){
      if(values.amount_unambiguous!==true) return {status:'blocked',reason:'Birden çok işlem/talep veya fer’î kalem varsa istinafa konu parasal değer tek ve tartışmasız olarak doğrulanmalıdır.'};
      const amount=nonNegativeNumber(values.dispute_amount);
      if(amount===null) return {status:'blocked',reason:'İstinafa konu uyuşmazlık tutarı girilmelidir.'};
      const set=thresholdForCase('İYUK','İstinaf',{lawsuitDate:values.lawsuit_date});
      if(set.status!=='resolved') return set;
      thresholdReference=thresholdReferenceMeta(set);
      if(amount<=set.threshold) return {status:'no',title:'Parasal sınır nedeniyle istinaf yolu kapalı',reason:`Uyuşmazlık değeri ${money(amount)}; dava tarihi yılı İYUK istinaf sınırı ${money(set.threshold)} ve sınırı geçmiyor.`,threshold:set.threshold,thresholdReference};
      routeReason=`Uyuşmazlık değeri ${money(amount)}, ${money(set.threshold)} İYUK istinaf sınırını aşıyor.`;
    }
    const output=deadlineFromService(rule,values,30,'day','İYUK istinaf başvurusunun son günü',[routeReason,'Çalışmaya ara verme rejimi kullanıcı seçimi olmadan otomatik uygulandı.']);
    if(thresholdReference) output.thresholdReference=thresholdReference;
    return output;
  }

  function resolveTtkNonAcceptance(rule,values){
    if(values.instrument_type!=='police') return {status:'na',title:'Kabul etmeme protestosu uygulanmaz',reason:'Kabul etmeme protestosu poliçeye özgüdür; bono ve çekte bu motor tarih üretmez.'};
    if(values.force_majeure===true) return {status:'blocked',reason:'Mücbir sebebin başlangıç, ihbar, bitiş ve otuz günlük sonuçları doğrulanmadan TTK m.731 hesabı yapılamaz.'};
    if(values.acceptance_route==='prohibited'||values.acceptance_route==='not_required') return {status:'na',title:'Kabul/protesto rotası uygulanmaz',reason:'Seçilen poliçede kabul için ibraz yasaklanmış veya kabul ibrazı zorunlu değildir.'};
    if(values.insolvency_branch==='bankruptcy') return {status:'na',title:'İflas kararı protesto yerine geçer',reason:'Muhatabın/keşidecinin iflası dalında kanundaki iflas kararı ibraz ve protesto yerine geçen özel ispat rotasıdır.'};
    if(values.insolvency_branch!=='none') return {status:'blocked',reason:'Ödemelerin durması veya sonuçsuz icra dalında ibraz/protesto olguları dosyadan ayrıca doğrulanmalıdır.'};

    const issue=dateFromField(values,'issue_date');
    let nominal;
    if(values.acceptance_route==='after_sight_statutory'&&values.acceptance_period_modified!==true) nominal=addYearsClamped(issue,1);
    else nominal=dateFromField(values,'acceptance_deadline');
    if(!nominal) return {status:'blocked',reason:'Uygulanacak kabul için ibraz süresinin son günü çözülemedi.'};
    if(nominal<issue) return {status:'blocked',reason:'Kabul için ibraz son günü düzenleme tarihinden önce olamaz.'};
    const presentation=finalEntry(rule,values,'acceptance_presentation','Kabul için ibrazın son günü',nominal);
    if(presentation.status==='blocked') return presentation;
    const actual=dateFromField(values,'first_presentation_date');
    if(actual&&actual<issue) return {status:'blocked',reason:'İlk ibraz tarihi senedin düzenlenme tarihinden önce olamaz.'};
    if(actual>parseISO(presentation.date)) return {status:'no',title:'Kabul için ibraz süresi kaçırılmış',reason:`İlk ibraz ${fmtTR(actual)}; hukukî son gün ${fmtTR(presentation.date)}.`};

    let protestDate=parseISO(presentation.date);
    if(actual&&iso(actual)===presentation.date&&values.second_presentation_requested===true) protestDate=addDays(protestDate,1);
    const protestRequired=values.no_protest_clause==='none';
    const entries=[presentation];
    if(protestRequired) entries.push(finalEntry(rule,values,'nonacceptance_protest','Kabul etmeme protestosunun son günü',protestDate));
    const output=timelineResult(entries,protestRequired?'latest':'earliest','Poliçe kabul ve protesto zaman çizelgesi');
    output.notes=[...(output.notes||[]),values.second_presentation_requested===true?'Muhatap son gündeki ilk ibrazda ertesi gün ikinci ibraz istemişse protesto ertesi gün düzenlenebilir.':'Kabul etmeme protestosu kabul için ibraz süresi içinde düzenlenmelidir.',protestRequired?'Protestodan vazgeçme kaydı seçilmedi.':'Protestodan vazgeçme kaydı protestoyu kaldırır; zamanında ibraz ve ihbar yükümlülükleri devam eder.',values.partial_acceptance===true?'Kısmi kabul olgusu işaretlendi; kabul edilmeyen kısım için rücu şartları ayrıca korunmalıdır.':''].filter(Boolean);
    return output;
  }

  function resolveTtkPayment(rule,values){
    if(!['police','bono'].includes(values.instrument_type)) return {status:'na',title:'Bu araç için uygulanmaz',reason:'Bu kural poliçe ve bono içindir; çek ibrazı ayrı TTK m.796–809 motorunda hesaplanır.'};
    if(values.force_majeure===true) return {status:'blocked',reason:'Mücbir sebebin başlangıç, ihbar ve bitiş tarihleri doğrulanmadan TTK m.731 uzama/erken rücu sonucu hesaplanamaz.'};
    if(values.maturity_type==='invalid') return {status:'no',title:'Vade kaydı geçersiz',reason:'Birbirini izleyen veya TTK m.703 dışında kalan vade kaydı geçersizdir; geçerli vade belirlenmeden ibraz/protesto tarihi üretilemez.'};
    if(values.insolvency_branch==='bankruptcy') return {status:'na',title:'İflas kararı özel rücu belgesidir',reason:'İflas dalında kanundaki iflas kararı ibraz/protesto yerine geçen özel rotadır.'};
    if(values.maturity_terms_verified!==true) return {status:'blocked',reason:'Senetteki vade kaydı ve varsa değiştiren kayıtlar belge üzerinden doğrulanmalıdır.'};

    const issue=dateFromField(values,'issue_date');
    const protestRequired=values.target_obligor==='endorser_aval'&&values.no_protest_clause==='none';
    if(values.maturity_type==='sight'&&protestRequired) return {status:'conditional',reason:'Görüldüğünde vadeli senette cirantaya başvuru için fiilî ibraz günü ve protesto kayıtları birlikte incelenmelidir. Kesin protesto son günü hesaplanamadı.'};
    if(values.maturity_type==='sight'){
      let nominal=values.presentation_period_modified===true?dateFromField(values,'sight_presentation_deadline'):addYearsClamped(issue,1);
      if(!nominal||nominal<issue) return {status:'blocked',reason:'Görüldüğünde vadeli senedin ibraz süresi sonu çözülemedi veya düzenleme tarihinden önce.'};
      const present=finalEntry(rule,values,'sight_payment_presentation','Görüldüğünde vadeli senedin ödeme için ibraz son günü',nominal);
      if(present.status==='blocked') return present;
      const entries=[present];
      if(protestRequired) entries.push(finalEntry(rule,values,'sight_nonpayment_protest','Ödememe protestosunun son günü',parseISO(present.date)));
      const out=timelineResult(entries,'latest','Görüldüğünde vadeli senet zaman çizelgesi');
      out.notes=[...(out.notes||[]),protestRequired?'Ciranta/avaliste rücu için ödememe protestosu ibraz süresi içinde düzenlenmelidir.':'Asıl borçluya başvuru veya seçilen protestodan vazgeçme kaydı nedeniyle protesto kontrol eden son gün değildir; zamanında ibraz yine gösterildi.'];
      return out;
    }

    const maturity=dateFromField(values,'legal_maturity_date');
    if(!maturity||maturity<issue) return {status:'blocked',reason:'Geçerli hukukî vade tarihi, düzenleme tarihinden önce olmayacak şekilde girilmelidir.'};
    const paymentDay=nextWorkingDay(maturity);
    if(!paymentDay) return {status:'blocked',reason:'Vade gününün ödeme gününe taşınması tatil takvimi kapsamı dışında kaldı.'};
    const presentEnd=addBusinessDays(paymentDay,2);
    if(!presentEnd) return {status:'blocked',reason:'Ödeme için ibraz/protesto iş günü hesabı tatil takvimi kapsamı dışında kaldı.'};
    const entries=[
      {status:'ok',id:'legal_payment_day',label:'Hukukî ödeme günü',date:iso(paymentDay),nominalDate:iso(maturity),kind:'milestone',controls:false,cutoff:null,notes:paymentDay.getTime()===maturity.getTime()?[]:['Vade çalışma günü olmadığı için ödeme günü izleyen ilk çalışma gününe taşındı.']},
      finalEntry(rule,values,'payment_presentation','Ödeme için ibrazın son günü',presentEnd)
    ];
    if(protestRequired) entries.push(finalEntry(rule,values,'nonpayment_protest','Ödememe protestosunun son günü',presentEnd));
    const output=timelineResult(entries,'latest','Poliçe/bono ödeme ve protesto zaman çizelgesi');
    output.notes=[...(output.notes||[]),protestRequired?'Belirli gün/sonra vadeli senette ödememe protestosu ödeme gününü izleyen iki iş günü içinde düzenlenir.':'Bono düzenleyeni/poliçe kabul edeni veya protestodan vazgeçme kaydı seçildi; protesto kontrol eden son gün değil, fakat ödeme için ibraz süresi gösterildi.',values.insolvency_branch==='payment_suspension'?'Ödemelerin durması/sonuçsuz icra dalında erken rücu için ayrıca ibraz ve protesto belgesi aranır.':''].filter(Boolean);
    return output;
  }

  function resolveTbk352(rule,v){
    const route=v.tahliye_yolu;
    if(route==='execution'&&v.branch_choice!=='undertaking') return {status:'blocked',reason:'TBK m.352 kapsamında bu tahliye sebebi için dava yolu seçilmelidir; taahhüde dayalı icra dalı uygulanamaz.'};
    const key={undertaking:'taahhut_tarihi',two_notices:'kira_donemi_sonu',tenant_home:'sozlesme_sonu'}[v.branch_choice];
    const start=dateFromField(v,key);
    if(!start) return {status:'blocked',reason:'Tahliye sebebine ait başlangıç tarihi gerekli.'};
    const effectiveRule={...rule,regime:route==='lawsuit'?'HMK':'IIK'};
    let nominal=addMonthsClamped(start,1);
    const base=finalizeDeadline(effectiveRule,nominal,v);
    if(base.status==='blocked') return base;
    const notes=[];
    if(route==='execution') return timelineResult([finalEntry(effectiveRule,v,'execution','Taahhüde dayalı icraya başvuru son günü',nominal)]);
    let conditional=false;
    if(v.kira_uzatma===true){
      const notice=dateFromField(v,'bildirim_ulasma'), end=dateFromField(v,'uzayan_kira_yili_sonu');
      if(!notice||notice>base.date) return {status:'blocked',reason:'Yazılı bildirim ilk dava süresi sonuna kadar ulaşmış olmalı; geç bildirim otomatik uzatma sağlamaz.',baseDeadline:iso(base.date)};
      if(!end||end<=base.date||end>addYearsClamped(base.date,1)) return {status:'blocked',reason:'Uzayan kira yılı sonu, ilk dava süresi sonundan sonra ve bir yıllık dış sınır içinde olmalı. Kira dönemi ve dayanağı kontrol edin.'};
      nominal=end;conditional=true;
      notes.push('TBK m.353: dosyadan girilen uzayan kira yılı sonu esas alındı; bu tarih araç tarafından bağımsız hukuki doğrulamadan geçirilmedi. Dayanak: '+v.uzatma_dayanak);
    }
    const entry=finalEntry(effectiveRule,v,'rental_action','Tahliye davası için süre sonu (arabuluculuk etkisi hariç)',nominal);
    if(entry.status==='blocked') return entry;
    if(['pending','ended'].includes(v.arabuluculuk_durumu)){
      const app=dateFromField(v,'arabuluculuk_basvuru'), end=dateFromField(v,'arabuluculuk_son');
      if(!app||(end&&end<app)) return {status:'blocked',reason:'Arabuluculuk tarih sırası geçersiz.'};
      if(app<start) return {status:'conditional',title:'Kira süresi başlamadan arabuluculuk',reason:'Erken başvurunun dava şartına ve süreye etkisi dosyada ayrıca değerlendirilmelidir.',notes};
      if(app>parseISO(entry.date)) return {status:'blocked',reason:'Arabuluculuğa başvuru, hesaplanan süre sonundan sonra; dolmuş süreyi otomatik canlandıran sonuç üretilmez.',baseDeadline:entry.date};
      return {status:'conditional',title:v.arabuluculuk_durumu==='pending'?'Arabuluculuk devam ediyor':'Arabuluculuk sonrası kalan süre',reason:'6325 m.18/A/15 kapsamında süre durması ayrıca uygulanmalı. Bu sürüm arabuluculuk sonrası kesin son günü hesaplamıyor; aşağıdaki tarih yalnız durma öncesi referanstır.',deadlines:[{...entry,label:'Arabuluculuk öncesi referans tarihi — güncel son gün değildir',controls:false}],notes:[...notes,'Başvuru: '+fmtTR(app),...(end?['Son tutanak: '+fmtTR(end)]:[])]};
    }
    const out=timelineResult([entry]);
    out.status='conditional';out.title=conditional?'Yazılı bildirime bağlı koşullu dava süresi':'Arabuluculuk öncesi dava süresi';
    out.notes=[...out.notes,...notes,'Arabuluculuk başvurusu yapılmadı seçildi. Bu hesap dava şartının tamamlandığını göstermez. Başvurudan sonra süre yeniden değerlendirilmelidir.'];
    return out;
  }

  function ruleCanCalculate(rule){
    if(!rule) return {ok:false,reason:'Kural bulunamadı.'};
    const a=rule.audit||{};
    const calc=rule.calculation||{};
    if(calc.status!=='verified'||!calc.resolver||calc.resolver==='none') return {ok:false,reason:calc.reason||a.production_decision||'Bu hukukî kural için doğrulanmış yürütülebilir resolver yok; otomatik tarih üretimi kapalı.'};
    if(a.manual||a.wrong||a.missing||a.ready!==true) return {ok:false,reason:'Denetim ve yürütülebilirlik bayrakları kesin tarih üretimine izin vermiyor.'};
    if(!calc.source||!calc.checked_on) return {ok:false,reason:'Resolver için resmî kaynak ve doğrulama tarihi kaydı eksik.'};
    return {ok:true};
  }

  function calculateRule(rule,input={}){
    const meta=rule?{rule_id:rule.rule_id,basis:rule.basis,source:rule.audit?.official_source||rule.source,engine_version:rule.engine_version}:{};
    const gate=ruleCanCalculate(rule); if(!gate.ok) return {status:'blocked',reason:gate.reason,...meta};
    const checked=validateRuleInputs(rule,input);
    if(!checked.ok){
      const details=[
        ...checked.missing.map(x=>`${x.label}: eksik`),
        ...checked.invalid.map(x=>`${x.label}: ${x.reason}`)
      ];
      return {status:'blocked',reason:'Zorunlu olgular doğrulanmadan hesap yapılamaz.',missingFields:checked.missing,invalidFields:checked.invalid,notes:details,...meta};
    }
    const values=checked.values, resolver=rule.calculation.resolver;
    let output, startBasis=[];
    if(resolver==='judicial_extension'){
      const start=resolveRuleStart(rule,values); if(!start.ok) return {status:'blocked',reason:start.reason,candidates:start.candidates,...meta};
      startBasis=start.basis;
      const nominal=addDuration(start.date,rule.duration,rule.unit,{saturdayWorking:values.saturday_working===true});
      if(!nominal) return {status:'blocked',reason:'Asıl süre çözülemedi.',...meta};
      const baseFinal=finalizeDeadline(rule,nominal,{...values,__period_start:iso(start.date),__duration:rule.duration,__unit:rule.unit,__saturday_working:values.saturday_working===true}); if(baseFinal.status==='blocked') return {...baseFinal,...meta};
      const auditBranch=(rule.audit.branches||[]).find(x=>x.type==='judicial_extension')||{};
      output=judicialExtension(rule,{...auditBranch,max_duration:rule.calculation.max_duration,max_unit:rule.calculation.max_unit},values,{date:baseFinal.date,cutoff:baseFinal.cutoff,notes:baseFinal.notes});
    } else {
      const resolvers={tbk352:resolveTbk352,timeline:resolveTimeline,uets:resolveUetsRule,iyuk10:resolveIyuk10,iyuk11:resolveIyuk11,tbk72:resolveTbk72,ktk97:resolveKtk97,iik134:resolveIik134,iik106:resolveIik106,foreign_service:resolveForeignService,aym_application:resolveAym,hmk_retrial:resolveHmkRetrial,cmk308:resolveCmk308,cmk308a:resolveCmk308a,hmk_appeal:resolveHmkAppeal,hmk_cassation:resolveHmkCassation,iyuk_appeal:resolveIyukAppeal,ttk_nonacceptance:resolveTtkNonAcceptance,ttk_payment:resolveTtkPayment};
      const fn=resolvers[resolver];
      output=fn?fn(rule,values):{status:'blocked',reason:`Bilinmeyen resolver türü: ${resolver}`};
    }
    if(rule.audit.temporal_gate) output.notes=[...(output.notes||[]),'Tarihsel sürüm: '+rule.audit.temporal_gate];
    return {...output,...meta,assumptions:[],input_snapshot:values,start_basis:startBasis};
  }

  function normalizeRegimeKey(regime){
    return String(regime||'').trim().toLocaleUpperCase('tr').replace(/[İI]/g,'I');
  }

  function threshold(regime,way,year=2026){
    // Parasal sınırlar yıl bazlı veri setinden okunur. Kod içinde hukuki eşik fallback'i yoktur.
    // Böylece yeni yılda veri güncellenmeden eski eşiklerin sessizce uygulanması engellenir.
    const dataset=data[`thresholds_${year}`];
    if(!Array.isArray(dataset)) return null;
    const x=dataset.find(t=>normalizeRegimeKey(t.Rejim)===normalizeRegimeKey(regime) && String(t['Kanun yolu']).toLocaleLowerCase('tr')===String(way).toLocaleLowerCase('tr'));
    const key=`${year} sınırı`;
    const value=x?Number(x[key]):NaN;
    return Number.isFinite(value)?value:null;
  }

  function thresholdReferencePolicy(regime){
    const regimes=data.threshold_reference_schema?.regimes||{};
    const wanted=normalizeRegimeKey(regime);
    const entry=Object.entries(regimes).find(([key])=>normalizeRegimeKey(key)===wanted);
    return entry?{regime:entry[0],...entry[1]}:null;
  }

  function resolveThresholdReference(regime,facts={}){
    const policy=thresholdReferencePolicy(regime);
    if(!policy) return {status:'blocked',title:'Eşik referans politikası yok',reason:`${regime||'Bilinmeyen'} rejimi için doğrulanmış parasal sınır referans politikası tanımlı değil.`};
    let event=policy.event, eventConfig=policy;
    if(policy.mode==='event_choice'){
      event=String(facts[policy.selector_field]||'');
      eventConfig=policy.events?.[event];
      if(!eventConfig){
        const expected=Object.values(policy.events||{}).map(x=>x.label).join(' veya ');
        return {status:'blocked',title:'Eşik olayı gerekli',reason:`${policy.regime} için ${expected||'referans olayı'} seçilmeden eşik yılı belirlenemez.`,regime:policy.regime,expectedEvents:Object.keys(policy.events||{})};
      }
    }
    const dateField=eventConfig.date_field;
    const referenceDate=parseISO(facts[dateField]);
    if(!referenceDate) return {status:'blocked',title:'Eşik referans tarihi gerekli',reason:`${eventConfig.label||policy.label} geçerli bir tarih olarak girilmeden parasal sınır seçilemez.`,regime:policy.regime,referenceEvent:event,dateField};
    const currentTextEffective=parseISO(policy.current_text_effective);
    if(currentTextEffective&&referenceDate<currentTextEffective) return {status:'blocked',title:'Tarihsel eşik metni gerekli',reason:`${fmtTR(referenceDate)} tarihli olay, veri setindeki güncel eşik referans metninin yürürlük tarihinden önce. Eski metin doğrulanmadan güncel eşik uygulanamaz.`,regime:policy.regime,referenceEvent:event,dateField};
    return {
      status:'resolved',
      regime:policy.regime,
      referenceEvent:event,
      referenceLabel:eventConfig.label||policy.label,
      dateField,
      referenceDate:iso(referenceDate),
      year:referenceDate.getUTCFullYear(),
      basis:policy.basis,
      source:policy.source,
      currentTextEffective:policy.current_text_effective
    };
  }

  function thresholdForCase(regime,way,facts={}){
    const reference=resolveThresholdReference(regime,facts);
    if(reference.status!=='resolved') return reference;
    const value=threshold(reference.regime,way,reference.year);
    if(value===null) return {...reference,status:'blocked',title:'Parasal sınır verisi yok',reason:`${reference.year} yılı ${reference.regime} ${way} parasal sınırı doğrulanmış veri setinde bulunmuyor; ${reference.referenceLabel.toLocaleLowerCase('tr')} esas alınarak eski/yeni yıl eşiği tahmin edilmez.`};
    return {...reference,status:'resolved',way,threshold:value};
  }

  function nonNegativeNumber(value){
    // HTML number input boşken Number('') === 0 olur. Hukuki hesapta boş alanın sıfır sayılmasını engeller.
    if(value===null || value===undefined || String(value).trim()==='') return null;
    const n=Number(value);
    return Number.isFinite(n) && n>=0 ? n : null;
  }

  function hmk362_3(i){
    const decisionDate=parseISO(i.decisionDate);
    if(!decisionDate) return {status:'blocked',title:'Karar tarihi gerekli',reason:'HMK m.362/3 değerlendirmesinde BAM karar tarihi dosya kronolojisi için zorunlu.'};
    if(booleanValue(i.temporalApplicabilityConfirmed)!==true){
      return {
        status:'blocked',
        title:'HMK 362/3 zaman bakımından uygulama teyidi gerekli',
        reason:'7589 sayılı Kanun, İYUK m.46/2 için açık bir geçiş hükmü kurmuş; HMK m.362/3 için aynı nitelikte özel geçiş hükmü kurmamıştır. Yalnız BAM karar tarihine bakılarak eski/yeni rejim seçilmez; somut dosyada yeni fıkranın uygulanacağı ayrıca doğrulanmalıdır.'
      };
    }
    const redecided=booleanValue(i.redecided), costsOnly=booleanValue(i.costsOnly), otherFinality=booleanValue(i.otherFinality);
    if([redecided,costsOnly,otherFinality].some(x=>x===null)) return {status:'blocked',title:'Hukukî olgular eksik',reason:'Yeniden esas hakkında karar, yalnız gider/vekâlet ücreti ve diğer kesinlik sebebi olgularının her biri Evet/Hayır olarak doğrulanmalıdır.'};
    const lawsuitDate=parseISO(i.lawsuitDate);
    if(lawsuitDate&&lawsuitDate>decisionDate) return {status:'blocked',title:'Tarih sırası çelişkili',reason:'Dava tarihi BAM karar tarihinden sonra olamaz.'};
    if(!redecided) return {status:'na',title:'HMK 362/3 uygulanmaz',reason:'BAM istinafı kabul ederek yeniden esas hakkında karar vermediyse yeni 362/3 dalı çalışmaz; genel HMK 361–362 değerlendirilir.'};
    if(otherFinality) return {status:'blocked',title:'Başka kesinlik sebebi',reason:'HMK m.362/1 kapsamındaki diğer temyiz edilemezlik sebepleri ayrıca değerlendirilmeden sonuç üretilemez.'};
    const thresholdSet=thresholdForCase('HMK','İstinaf',{lawsuitDate:i.lawsuitDate});
    if(thresholdSet.status!=='resolved') return thresholdSet;
    const year=thresholdSet.year, appeal=thresholdSet.threshold, cass=threshold('HMK','Temyiz',year);
    if(cass===null) return {...thresholdSet,status:'blocked',title:'Parasal sınır verisi yok',reason:`${year} yılı HMK temyiz parasal sınırı doğrulanmış veri setinde bulunmuyor; dava tarihi yılı yerine karar yılı kullanılamaz.`};
    const thresholdReference={regime:'HMK',event:thresholdSet.referenceEvent,label:thresholdSet.referenceLabel,date:thresholdSet.referenceDate,year,basis:thresholdSet.basis,source:thresholdSet.source};
    const meta={appeal,cass,year,thresholdReference};
    const part=nonNegativeNumber(i.acceptedRejectedAmount), bam=nonNegativeNumber(i.bamValue), first=nonNegativeNumber(i.firstValue);
    if(part===null||bam===null||first===null) return {status:'blocked',title:'Parasal veriler eksik',reason:'Kabul/ret edilen kısım, BAM hüküm değeri ve ilk derece hüküm değeri birlikte ve sıfırdan küçük olmayacak şekilde girilmeli.',...meta};
    const diff=Math.abs(bam-first);
    if(part<=appeal) return {status:'no',title:'Temyiz edilemez',reason:`Kabul veya ret edilen kısım ${money(part)}; HMK 341/2 için dava tarihi yılı ${year} sınırı ${money(appeal)} ve kanun “üzerinde” olmasını arıyor.`,...meta,diff};
    if(bam===cass) return {status:'blocked',title:'Temyiz sınırına eşitlik teyidi gerekli',reason:'HMK m.362/3(a) “temyiz sınırının altında kalan” kararları düzenliyor. BAM değerinin sınıra tam eşit olduğu durumda genel m.362/1 ile yeni m.362/3 ilişkisinin dosyada teyidi gerekir.',...meta,diff};
    if(bam<cass){
      if(diff<=appeal) return {status:'no',title:'Temyiz edilemez',reason:`BAM hüküm değeri genel temyiz sınırını geçmiyor ve ilk derece–BAM farkı ${money(diff)} ile ${money(appeal)} sınırını geçmiyor.`,...meta,diff};
      if(costsOnly) return {status:'no',title:'Temyiz edilemez',reason:'Genel temyiz sınırının altındaki BAM kararı yalnız yargılama gideri veya vekâlet ücretine ilişkin.',...meta,diff};
      return {status:'yes',resolved:true,title:'HMK 362/3 bakımından temyiz yolu açık',reason:`Kabul/ret kısmı ${money(appeal)} sınırını aşıyor; BAM değeri ${money(cass)} sınırının altında olsa da ilk derece–BAM farkı ${money(diff)} ile ${money(appeal)} sınırını aşıyor ve gider/vekâlet ücreti istisnası yok.`,...meta,diff};
    }
    return {status:'yes',resolved:true,title:'Parasal ölçüt bakımından temyiz yolu açık',reason:`Kabul/ret kısmı ${money(appeal)} sınırını ve BAM hüküm değeri ${money(cass)} genel temyiz sınırını aşıyor. Diğer HMK 362 kesinlik sebepleri ayrıca kontrol edilmiş olmalı.`,...meta,diff};
  }

  function iyuk46_2(i){
    const decisionDate=parseISO(i.decisionDate);
    if(!decisionDate) return {status:'blocked',title:'Karar tarihi gerekli',reason:'İYUK m.46/2 geçiş kuralı için BİM karar tarihi zorunlu.'};
    if(booleanValue(i.already46_1)===true){
      if(decisionDate<=parseISO('2026-07-31')) return {status:'old',title:'Önceki m.46 metni',reason:'Eski tarihli karar için ilgili tarihsel m.46/1 bendi ayrıca doğrulanmalıdır.'};
      const nonmonetary=['a','d','e','f','g','h','ı','i','j','k','l','m','n'];
      if(!i.basis461) return {status:'blocked',reason:'İYUK m.46/1 kapsamının hangi bentten geldiğini seçin.'};
      if(booleanValue(i.scope461Confirmed)!==true) return {status:'blocked',reason:'Seçilen bent, nihai karar niteliği ve uygulanabilir kanun yolu usulü dosyadan doğrulanmalıdır.'};
      const filed=parseISO(i.lawsuitDate);
      if(!filed||filed>decisionDate) return {status:'blocked',reason:'Geçerli ve karar tarihinden önceki dava tarihi gerekli.'};
      if(nonmonetary.includes(i.basis461)) return {status:'yes',resolved:true,title:'İYUK m.46/1 kapsamı',reason:'Dosyada doğrulanan '+i.basis461+' bendi esas alındı; bu bent için parasal sınır aranmadı.',notes:['Kapsam seçimi dosya olgularına bağlıdır; m.46/2 koşulları bu dala uygulanmadı.']};
      if(i.basis461!=='b') return {status:'blocked',reason:'Geçerli m.46/1 bendi seçin.'};
      const set=thresholdForCase('İYUK','Temyiz',{lawsuitDate:i.lawsuitDate});
      if(set.status!=='resolved') return set;
      const amount=nonNegativeNumber(i.bimValue);
      if(amount===null) return {status:'blocked',reason:'Temyize konu dava değeri gerekli.'};
      return amount>set.threshold?{status:'yes',resolved:true,title:'İYUK m.46/1(b)',reason:'Dosyada doğrulanan parasal dava değeri temyiz sınırını aşıyor.'}:{status:'no',reason:'Dava değeri m.46/1(b) temyiz sınırını aşmıyor; uygunsa ayrıca m.46/2 dalını değerlendirin.'};
    }
    if(decisionDate <= parseISO('2026-07-31')) return {status:'old',title:'Eski rejim',reason:'7589 geçici m.1/3 yeni m.46/2 dalını yürürlük tarihinden sonra verilen BİM kararlarına bağlar; 31.07.2026 ve öncesi kararlar önceki hükümlere tabidir.'};
    const booleanKeys=['already46_1','redecided','singleJudge','law4081','law3091','law6458','costsOnly'];
    const facts=Object.fromEntries(booleanKeys.map(key=>[key,booleanValue(i[key])]));
    if(Object.values(facts).some(x=>x===null)) return {status:'blocked',title:'Hukukî olgular eksik',reason:'İYUK m.46/1 kapsamı, yeniden karar, yasak dava türleri ve yalnız gider/vekâlet ücreti olgularının tümü Evet/Hayır olarak doğrulanmalıdır.'};
    const lawsuitDate=parseISO(i.lawsuitDate);
    if(lawsuitDate&&lawsuitDate>decisionDate) return {status:'blocked',title:'Tarih sırası çelişkili',reason:'Dava tarihi BİM karar tarihinden sonra olamaz.'};
    const thresholdSet=thresholdForCase('İYUK','İstinaf',{lawsuitDate:i.lawsuitDate});
    if(thresholdSet.status!=='resolved') return thresholdSet;
    const year=thresholdSet.year, appeal=thresholdSet.threshold, cass=threshold('İYUK','Temyiz',year);
    if(cass===null) return {...thresholdSet,status:'blocked',title:'Parasal sınır verisi yok',reason:`${year} yılı İYUK temyiz parasal sınırı doğrulanmış veri setinde bulunmuyor; dava tarihi yılı yerine karar yılı kullanılamaz.`};
    const thresholdReference={regime:'İYUK',event:thresholdSet.referenceEvent,label:thresholdSet.referenceLabel,date:thresholdSet.referenceDate,year,basis:thresholdSet.basis,source:thresholdSet.source};
    const meta={appeal,cass,year,thresholdReference};
    if(facts.already46_1) return {status:'yes',resolved:true,title:'İYUK 46/1 kapsamında temyiz',reason:'Dava zaten İYUK m.46/1 kapsamında ise 46/2 ikincil genişletme dalına ihtiyaç yoktur; temyiz 46/1 rejiminde değerlendirilir.',...meta};
    if(!facts.redecided) return {status:'na',title:'İYUK 46/2 uygulanmaz',reason:'BİM ilk derece kararını kaldırıp yeniden karar vermediyse yeni 46/2 dalı çalışmaz.',...meta};
    if(facts.singleJudge || facts.law4081 || facts.law3091 || facts.law6458) return {status:'no',title:'Temyiz edilemez',reason:'İYUK m.46/2’de açıkça temyiz dışı bırakılan dava/iş türlerinden biri seçildi.',...meta};
    if(facts.costsOnly) return {status:'no',title:'Temyiz edilemez',reason:'Karar yalnız vekâlet ücreti veya yargılama giderine ilişkin.',...meta};
    const bim=nonNegativeNumber(i.bimValue), first=nonNegativeNumber(i.firstValue);
    if(bim===null||first===null) return {status:'blocked',title:'Parasal veriler eksik',reason:'BİM yeniden karar değeri ile ilk derece karar değeri birlikte ve sıfırdan küçük olmayacak şekilde girilmeli.',...meta};
    const diff=Math.abs(bim-first);
    if(bim===cass) return {status:'blocked',title:'Temyiz sınırına eşitlik teyidi gerekli',reason:'İYUK m.46/2(e) “temyiz sınırının altında kalan” kararları düzenliyor. BİM değerinin sınıra tam eşit olduğu durumda m.46/1(b) ile yeni m.46/2 ilişkisinin dosyada teyidi gerekir.',...meta,diff};
    if(bim<cass && diff<=appeal) return {status:'no',title:'Temyiz edilemez',reason:`BİM değeri ${money(cass)} temyiz sınırının altında ve kararlar arasındaki fark ${money(diff)} ile ${money(appeal)} sınırını geçmiyor.`,...meta,diff};
    return {status:'yes',resolved:true,title:'İYUK 46/2 bakımından temyiz yolu açık',reason:`Yasak dava türlerinden biri yok; parasal fark/temyiz sınırı istisnası sonucu yolu kapatmıyor.`,...meta,diff};
  }

  global.WorkEngine={conditionMatches,parseISO,iso,fmtTR,money,addDays,addMonthsClamped,addYearsClamped,addBusinessDays,holidayInfo,isWorkingDay,calendarCoversDate,ruleRecessPolicy,automaticHmk103Exception,applyRegimeVacation,applyFinalHoliday,resolveService,resolveServiceRecipient,booleanValue,requiredInputKeys,getRuleInputFields,validateRuleInputs,ruleCanCalculate,calculateRule,threshold,resolveThresholdReference,thresholdForCase,nonNegativeNumber,hmk362_3,iyuk46_2};
})(window);
