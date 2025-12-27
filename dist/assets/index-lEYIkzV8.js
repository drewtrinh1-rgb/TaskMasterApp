var q=Object.defineProperty;var R=(c,e,t)=>e in c?q(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var o=(c,e,t)=>R(c,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=t(a);fetch(a.href,s)}})();const $="categorized-todo-items",z=300;class j extends Error{constructor(e,t){super(e),this.cause=t,this.name="StorageError"}}function W(c){var e,t;return{...c,dueDate:(e=c.dueDate)==null?void 0:e.toISOString(),createdAt:c.createdAt.toISOString(),completedAt:(t=c.completedAt)==null?void 0:t.toISOString()}}function G(c){return{...c,dueDate:c.dueDate?new Date(c.dueDate):void 0,createdAt:new Date(c.createdAt),completedAt:c.completedAt?new Date(c.completedAt):void 0}}class K{constructor(){o(this,"items",new Map);o(this,"debounceTimer",null);o(this,"storageAvailable",!0);this.checkStorageAvailability()}checkStorageAvailability(){try{const e="__storage_test__";typeof localStorage<"u"?(localStorage.setItem(e,e),localStorage.removeItem(e),this.storageAvailable=!0):this.storageAvailable=!1}catch{this.storageAvailable=!1}}isStorageAvailable(){return this.storageAvailable}async loadFromStorage(){if(!this.storageAvailable)return Array.from(this.items.values());try{const e=localStorage.getItem($);if(!e)return[];const t=JSON.parse(e);this.items.clear();for(const i of t){const a=G(i);this.items.set(a.id,a)}return Array.from(this.items.values())}catch(e){throw new j("Failed to load items from storage",e)}}persistToStorage(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>{this.persistImmediately()},z)}persistImmediately(){if(this.storageAvailable)try{const e=Array.from(this.items.values()).map(W),t=JSON.stringify(e);localStorage.setItem($,t)}catch(e){throw e instanceof DOMException&&e.name==="QuotaExceededError"?new j("Storage quota exceeded. Consider clearing old completed tasks.",e):new j("Failed to persist items to storage",e)}}async saveItem(e){this.items.set(e.id,e),this.persistToStorage()}async getItem(e){return this.items.get(e)??null}async getAllItems(){return Array.from(this.items.values())}async updateItem(e,t){const i=this.items.get(e);if(!i)throw new j(`Item with id ${e} not found`);const a={...i,...t,id:i.id};this.items.set(e,a),this.persistToStorage()}async deleteItem(e){this.items.delete(e),this.persistToStorage()}async clearAll(){this.items.clear(),this.storageAvailable&&localStorage.removeItem($)}async flush(){this.debounceTimer&&(clearTimeout(this.debounceTimer),this.debounceTimer=null),this.persistImmediately()}}var u=(c=>(c.SELF_CARE="self-care",c.EXERCISE="exercise",c.WORK="work",c.FRIENDS_SOCIAL="friends-social",c.TASKS="tasks",c.IMPORTANT_PRIORITY="important-priority",c.PARTNER="partner",c.KNOWLEDGE_HUB="knowledge-hub",c))(u||{});const S={"self-care":{name:"Self Care",color:"#FFD700",keywords:["meditation","spa","relax","sleep","therapy","mindfulness","self-care","rest","nap","massage","skincare","bath","wellness"]},exercise:{name:"Exercise",color:"#FFA500",keywords:["gym","workout","run","yoga","fitness","exercise","jog","swim","bike","hike","walk","training","badminton","tennis","basketball","football","soccer","volleyball","golf","cricket","baseball","hockey","rugby","boxing","martial","karate","judo","taekwondo","kickboxing","mma","pilates","crossfit","spinning","aerobics","zumba","stretching","cardio","weights","lifting","squash","racquetball","ping pong","table tennis","skiing","snowboard","skating","climbing","rowing","kayak","surf","diving","marathon","triathlon","cycling","jogging","treadmill","sport","sports","game","match","practice","play","court","field","track"]},work:{name:"Work",color:"#4169E1",keywords:["meeting","deadline","project","email","presentation","client","work","office","report","boss","conference","interview","review","proposal","budget","invoice","contract","negotiate","colleague","team","manager","employee","hr","salary","promotion","career","job","spreadsheet","document","memo","agenda","minutes","quarterly","annual","kpi"]},"friends-social":{name:"Friends/Social",color:"#32CD32",keywords:["dinner","party","hangout","catch up","birthday","friends","social","lunch","drinks","gathering","brunch","coffee","meetup","reunion","celebration","wedding","shower","bbq","picnic","movie","concert","festival","club","bar","restaurant","outing","trip","vacation","game night","karaoke","bowling","escape room","potluck","housewarming"]},tasks:{name:"Tasks",color:"#9370DB",keywords:["todo","task","errand","chore","buy","get","pick up","return","fix","clean","laundry","dishes","vacuum","mop","grocery","shopping","mail","package","delivery","appointment","schedule","book","reserve","renew","cancel","pay","bill","bank"]},"important-priority":{name:"Important/Priority",color:"#DC143C",keywords:["urgent","asap","critical","important","priority","emergency","must","deadline","immediately","now","today","crucial","essential","vital","key","top priority","high priority","time sensitive","overdue","late","reminder"]},partner:{name:"Partner",color:"#FF69B4",keywords:["date","anniversary","romantic","together","couple","partner","spouse","husband","wife","boyfriend","girlfriend","valentine","love","relationship","dinner date","movie date","surprise","gift for","flowers","chocolate","honeymoon","engagement","wedding anniversary"]},"knowledge-hub":{name:"Knowledge Hub",color:"#20B2AA",keywords:["remember","note","likes","favorite","gift idea","preference","info","fact","reference","idea","thought","inspiration","quote","bookmark","save","learn","research","study","recipe","tip","trick","hack","recommendation","suggestion","wishlist","bucket list"]}};function B(c){return c.trim().length>0}const A={[u.SELF_CARE]:["meditation","meditate","spa","relax","relaxing","sleep","nap","rest","resting","therapy","therapist","counseling","counselor","mindfulness","mindful","massage","facial","manicure","pedicure","salon","haircut","hair appointment","skincare","skin care","bath","bubble bath","wellness","self-care","selfcare","journal","journaling","gratitude","affirmation","breathing","breathe","detox","cleanse","pamper","treat myself","me time","alone time","mental health","anxiety","stress relief","destress","unwind","decompress","read","reading","book","audiobook","podcast"],[u.EXERCISE]:["gym","workout","work out","exercise","exercising","fitness","fit","training","train","trainer","personal trainer","weights","lifting","lift","cardio","treadmill","elliptical","stairmaster","rowing","rower","crossfit","hiit","bootcamp","boot camp","circuit","strength","run","running","jog","jogging","sprint","sprinting","marathon","half marathon","walk","walking","hike","hiking","trek","trekking","trail","badminton","tennis","squash","racquetball","ping pong","table tennis","pickleball","basketball","football","soccer","volleyball","baseball","softball","hockey","rugby","cricket","lacrosse","handball","golf","golfing","bowling","archery","fencing","wrestling","boxing","kickboxing","mma","martial arts","karate","judo","taekwondo","jiu jitsu","bjj","muay thai","kung fu","swim","swimming","pool","lap","laps","dive","diving","snorkel","snorkeling","surf","surfing","kayak","kayaking","canoe","paddle","paddleboard","sup","water polo","sailing","sail","boat","rowing","ski","skiing","snowboard","snowboarding","skate","skating","ice skating","bike","biking","bicycle","cycling","cycle","spin","spinning","peloton","yoga","pilates","stretch","stretching","flexibility","barre","dance","dancing","zumba","aerobics","step class","climb","climbing","boulder","bouldering","rock climbing","sport","sports","athletic","athlete","game","match","practice","play","court","field","track","stadium","arena","league","team","competition"],[u.WORK]:["meeting","meetings","meet with","call","conference","conference call","zoom","teams","slack","standup","stand-up","sync","one-on-one","1:1","1on1","presentation","present","demo","pitch","webinar","deadline","project","task","assignment","deliverable","milestone","report","document","documentation","proposal","draft","review","email","emails","inbox","respond","reply","follow up","follow-up","work","working","office","workplace","desk","computer","client","clients","customer","customers","stakeholder","vendor","boss","manager","supervisor","colleague","coworker","team","business","company","corporate","enterprise","startup","budget","invoice","contract","agreement","negotiate","negotiation","quarterly","annual","fiscal","revenue","profit","sales","kpi","metrics","analytics","data","spreadsheet","excel","interview","job","career","resume","cv","linkedin","networking","promotion","raise","salary","hr","human resources","onboarding","professional","certification","training","workshop","seminar"],[u.FRIENDS_SOCIAL]:["friend","friends","buddy","buddies","pal","pals","bestie","bff","hangout","hang out","hanging out","catch up","catching up","get together","social","socialize","socializing","meetup","meet up","dinner","lunch","brunch","breakfast","coffee","drinks","happy hour","restaurant","cafe","bar","pub","club","nightclub","lounge","bbq","barbecue","cookout","potluck","picnic","party","parties","birthday","celebration","celebrate","celebrating","wedding","shower","baby shower","bridal shower","bachelor","bachelorette","graduation","anniversary","reunion","gathering","event","housewarming","house warming","farewell","going away","movie","movies","cinema","theater","theatre","show","concert","festival","fair","carnival","parade","fireworks","game night","board game","card game","trivia","karaoke","bowling","escape room","arcade","mini golf","laser tag","trip","travel","vacation","getaway","road trip","weekend trip","outing","excursion","adventure","explore","call friend","text","message","chat","video call","facetime"],[u.TASKS]:["errand","errands","chore","chores","todo","to-do","to do","buy","purchase","shop","shopping","grocery","groceries","store","order","amazon","online","pickup","pick up","pick-up","clean","cleaning","vacuum","mop","dust","dusting","sweep","sweeping","laundry","wash","washing","dishes","dishwasher","trash","garbage","recycle","organize","organizing","declutter","tidy","tidying","fix","repair","maintenance","maintain","replace","install","appointment","schedule","book","reserve","reservation","renew","cancel","reschedule","confirm","confirmation","pay","payment","bill","bills","bank","banking","deposit","transfer","mail","post office","package","delivery","ship","shipping","return","paperwork","form","forms","sign","signature","notary","tax","taxes","insurance","registration","license","permit","get","grab","drop off","drop-off","bring","take","move","call","contact","reach out","check","verify","update","change"],[u.IMPORTANT_PRIORITY]:["urgent","urgently","asap","immediately","right away","right now","now","today","tonight","this morning","this afternoon","this evening","important","priority","high priority","top priority","critical","crucial","essential","vital","key","must","must do","have to","need to","deadline","due","overdue","late","behind","time sensitive","time-sensitive","expiring","expires","last chance","final","last day","ends today","emergency","emergent","crisis","urgent care","er","hospital","reminder","remind","don't forget","dont forget","remember","before","by","no later than"],[u.PARTNER]:["partner","spouse","husband","wife","boyfriend","girlfriend","bf","gf","babe","baby","honey","sweetie","darling","love","significant other","so","fiance","fiancee","date","date night","romantic","romance","anniversary","valentine","dinner date","movie date","lunch date","breakfast date","together","couple","couples","us","we","our","quality time","spend time","cuddle","cuddling","gift for","present for","surprise","flowers","chocolate","jewelry","card","love letter","romantic gesture","engagement","wedding","honeymoon","wedding anniversary","first date","proposal","propose"],[u.KNOWLEDGE_HUB]:["remember","note","notes","note to self","memo","jot down","info","information","fact","facts","reference","lookup","look up","likes","like","favorite","favourite","preference","prefers","idea","ideas","thought","thoughts","inspiration","inspired","gift idea","gift ideas","wishlist","wish list","want","wants","learn","learning","study","studying","research","researching","course","class","lesson","tutorial","how to","howto","save","saved","bookmark","bookmarked","keep","store","quote","quotes","saying","sayings","recipe","recipes","ingredient","ingredients","cooking tip","tip","tips","trick","tricks","hack","hacks","lifehack","recommendation","recommend","recommended","suggestion","suggest","review","reviews","rating","rated","bucket list","list of","collection","catalog","catalogue"]},Y=["do","complete","finish","make","create","build","fix","repair","buy","get","pick up","return","call","email","send","schedule","book","reserve","attend","go to","meet","visit","clean","organize","submit","prepare","setup","set up","install","update","check","pay","renew","cancel","confirm","sign up","register"];class _{normalize(e){return e.toLowerCase().trim().replace(/\s+/g," ")}containsKeyword(e,t){const i=this.normalize(e),a=this.normalize(t);if(i.includes(a))return!0;if(!a.includes(" ")){const s=i.split(/\s+/);for(const n of s)if(n===a||n.startsWith(a)&&n.length<=a.length+4||a.startsWith(n)&&a.length<=n.length+4)return!0}return!1}calculateScore(e,t){let i=0;const a=new Set;for(const s of t)if(this.containsKeyword(e,s)&&!a.has(s)){const n=1+s.length/10;i+=n,a.add(s),this.normalize(e).split(/\s+/).includes(this.normalize(s))&&(i+=.5)}return i}categorize(e){if(!e||e.trim().length===0)return u.TASKS;const t=new Map;for(const[s,n]of Object.entries(A)){const r=this.calculateScore(e,n);t.set(s,r)}let i=u.TASKS,a=0;for(const[s,n]of t)n>a&&(a=n,i=s);return a<.5?u.TASKS:i}detectType(e){const t=this.normalize(e);for(const a of Y)if(this.containsKeyword(t,a))return"task";return this.calculateScore(e,A[u.KNOWLEDGE_HUB])>=1?"note":"task"}getCategoryScores(e){const t=new Map;for(const[i,a]of Object.entries(A)){const s=this.calculateScore(e,a);t.set(i,s)}return t}getKeywords(e){return A[e]||[]}}function U(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const e=Math.random()*16|0;return(c==="x"?e:e&3|8).toString(16)})}class E extends Error{constructor(e){super(e),this.name="ItemError"}}class V{constructor(e,t){o(this,"storageManager");o(this,"categorizationEngine");this.storageManager=e,this.categorizationEngine=t}async createItem(e){if(!B(e.description))throw new E("Description cannot be empty or whitespace only");const t=e.category??this.categorizationEngine.categorize(e.description);let i=e.type??this.categorizationEngine.detectType(e.description);t===u.KNOWLEDGE_HUB&&(i="note"),e.isHabit&&i==="note"&&(i="task");const a={id:U(),description:e.description.trim(),category:t,type:i,completed:!1,dueDate:e.dueDate,location:e.location,tags:e.tags,createdAt:new Date,priority:e.priority||"normal",effortLevel:e.effortLevel,isHabit:e.isHabit||!1,habitStreak:e.isHabit?{currentStreak:0,longestStreak:0,totalCompletions:0,completionDates:[]}:void 0,points:0,implementationIntention:e.implementationIntention,habitStack:e.habitStack,isTemplate:e.isTemplate||!1,templateName:e.templateName};return await this.storageManager.saveItem(a),a}async getItem(e){return this.storageManager.getItem(e)}async getAllItems(){return this.storageManager.getAllItems()}async updateItem(e,t){const i=await this.storageManager.getItem(e);if(!i)throw new E(`Item with id ${e} not found`);if(t.description!==void 0&&!B(t.description))throw new E("Description cannot be empty or whitespace only");const a={};t.description!==void 0&&(a.description=t.description.trim()),t.category!==void 0&&(a.category=t.category),t.dueDate===null?a.dueDate=void 0:t.dueDate!==void 0&&(a.dueDate=t.dueDate),t.location===null?a.location=void 0:t.location!==void 0&&(a.location=t.location),t.tags!==void 0&&(a.tags=t.tags),t.priority!==void 0&&(a.priority=t.priority),t.effortLevel!==void 0&&(a.effortLevel=t.effortLevel),t.isHabit!==void 0&&(a.isHabit=t.isHabit,t.isHabit&&!i.habitStreak&&(a.habitStreak={currentStreak:0,longestStreak:0,totalCompletions:0,completionDates:[]})),t.implementationIntention!==void 0&&(a.implementationIntention=t.implementationIntention),t.habitStack!==void 0&&(a.habitStack=t.habitStack),await this.storageManager.updateItem(e,a);const s=await this.storageManager.getItem(e);if(!s)throw new E("Failed to retrieve updated item");return s}async deleteItem(e){await this.storageManager.deleteItem(e)}async markComplete(e){const t=await this.storageManager.getItem(e);if(!t)throw new E(`Item with id ${e} not found`);if(t.type==="note")throw new E("Notes cannot be marked as complete");const i=new Date,a={completed:!0,completedAt:i};if(t.isHabit&&t.habitStreak){const n=new Date;n.setHours(0,0,0,0);const r=t.habitStreak.lastCompletedDate?new Date(t.habitStreak.lastCompletedDate):null;if(r&&r.setHours(0,0,0,0),r&&r.getTime()===n.getTime())a.completed=!0,a.completedAt=i;else{let l=1,p=!1;if(r){const m=new Date(n);if(m.setDate(m.getDate()-1),r.getTime()===m.getTime())l=(t.habitStreak.currentStreak||0)+1,p=!1;else{const d=new Date(n);d.setDate(d.getDate()-2),r.getTime()===d.getTime()?(l=(t.habitStreak.currentStreak||0)+1,p=!0):(l=1,p=!1)}}const g=[...t.habitStreak.completionDates||[],n];a.habitStreak={currentStreak:l,longestStreak:Math.max(l,t.habitStreak.longestStreak||0),lastCompletedDate:n,totalCompletions:(t.habitStreak.totalCompletions||0)+1,completionDates:g,missedYesterday:!1};const w=10,v=Math.min(l*2,50),h=p?10:0;a.points=(t.points||0)+w+v+h}}else{const n=t.effortLevel==="quick"?5:10,r=t.priority==="daily-focus"?15:0;a.points=(t.points||0)+n+r}await this.storageManager.updateItem(e,a);const s=await this.storageManager.getItem(e);if(!s)throw new E("Failed to retrieve updated item");return s}async markIncomplete(e){const t=await this.storageManager.getItem(e);if(!t)throw new E(`Item with id ${e} not found`);if(t.type==="note")throw new E("Notes cannot be marked as incomplete");await this.storageManager.updateItem(e,{completed:!1,completedAt:void 0});const i=await this.storageManager.getItem(e);if(!i)throw new E("Failed to retrieve updated item");return i}async loadItems(){return this.storageManager.loadFromStorage()}getSuggestedCategory(e){return this.categorizationEngine.categorize(e)}async setPriority(e,t){if(!await this.storageManager.getItem(e))throw new E(`Item with id ${e} not found`);await this.storageManager.updateItem(e,{priority:t||"normal"});const a=await this.storageManager.getItem(e);if(!a)throw new E("Failed to retrieve updated item");return a}async checkMissedHabits(){const t=(await this.getAllItems()).filter(s=>s.isHabit&&s.habitStreak),i=new Date;i.setHours(0,0,0,0);const a=new Date(i);a.setDate(a.getDate()-1);for(const s of t){if(!s.habitStreak)continue;const n=s.habitStreak.lastCompletedDate?new Date(s.habitStreak.lastCompletedDate):null;n&&(n.setHours(0,0,0,0),n.getTime()<a.getTime()&&await this.storageManager.updateItem(s.id,{habitStreak:{...s.habitStreak,missedYesterday:!0}}))}}}class N{isOverdue(e){if(!e.dueDate||e.completed||e.type!=="task")return!1;const t=new Date,i=new Date(e.dueDate);return t.setHours(0,0,0,0),i.setHours(0,0,0,0),i<t}filterByCategory(e,t){return e.filter(i=>i.category===t)}filterByCompletion(e,t){return e.filter(i=>i.completed===t)}search(e,t){const i=t.toLowerCase().trim();return i?e.filter(a=>{var s;return!!(a.description.toLowerCase().includes(i)||(s=a.tags)!=null&&s.some(n=>n.toLowerCase().includes(i)))}):e}filterOverdue(e){return e.filter(t=>this.isOverdue(t))}applyFilters(e,t){let i=[...e];return t.category!==void 0&&(i=this.filterByCategory(i,t.category)),t.completed!==void 0&&(i=this.filterByCompletion(i,t.completed)),t.searchQuery&&(i=this.search(i,t.searchQuery)),t.overdue&&(i=this.filterOverdue(i)),i}sortByDueDate(e,t="asc"){return[...e].sort((i,a)=>{if(!i.dueDate&&!a.dueDate)return 0;if(!i.dueDate)return 1;if(!a.dueDate)return-1;const s=new Date(i.dueDate).getTime(),n=new Date(a.dueDate).getTime();return t==="asc"?s-n:n-s})}sortByCreatedAt(e,t="desc"){return[...e].sort((i,a)=>{const s=new Date(i.createdAt).getTime(),n=new Date(a.createdAt).getTime();return t==="asc"?s-n:n-s})}sortByDescription(e,t="asc"){return[...e].sort((i,a)=>{const s=i.description.localeCompare(a.description);return t==="asc"?s:-s})}sort(e,t,i="asc"){switch(t){case"dueDate":return this.sortByDueDate(e,i);case"createdAt":return this.sortByCreatedAt(e,i);case"description":return this.sortByDescription(e,i);default:return e}}}u.SELF_CARE,u.EXERCISE,u.PARTNER,u.FRIENDS_SOCIAL;u.WORK,u.IMPORTANT_PRIORITY,u.TASKS;class L{constructor(){o(this,"projects",[]);o(this,"STORAGE_KEY","projects");this.loadProjects()}loadProjects(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(e){const t=JSON.parse(e);this.projects=t.map(i=>({...i,createdAt:new Date(i.createdAt),updatedAt:new Date(i.updatedAt),applicationOpenDate:i.applicationOpenDate?new Date(i.applicationOpenDate):void 0,applicationDeadline:i.applicationDeadline?new Date(i.applicationDeadline):void 0,notificationDate:i.notificationDate?new Date(i.notificationDate):void 0,programStartDate:i.programStartDate?new Date(i.programStartDate):void 0,programEndDate:i.programEndDate?new Date(i.programEndDate):void 0,milestones:i.milestones.map(a=>({...a,date:new Date(a.date)})),notes:i.notes.map(a=>({...a,createdAt:new Date(a.createdAt)}))}))}}catch(e){console.error("Failed to load projects:",e)}}saveProjects(){try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(this.projects))}catch(e){console.error("Failed to save projects:",e)}}getAllProjects(){return[...this.projects]}getProject(e){return this.projects.find(t=>t.id===e)}createProject(e){const t={id:Date.now().toString(),title:e.title,description:e.description,status:"planning",category:e.category,applicationOpenDate:e.applicationOpenDate,applicationDeadline:e.applicationDeadline,notificationDate:e.notificationDate,programStartDate:e.programStartDate,programEndDate:e.programEndDate,progress:0,milestones:[],notes:[],questions:[],createdAt:new Date,updatedAt:new Date,url:e.url,priority:e.priority||"medium"};return this.projects.push(t),this.saveProjects(),t}updateProject(e,t){const i=this.projects.find(a=>a.id===e);if(i)return Object.assign(i,t,{updatedAt:new Date}),this.saveProjects(),i}deleteProject(e){const t=this.projects.findIndex(i=>i.id===e);return t===-1?!1:(this.projects.splice(t,1),this.saveProjects(),!0)}addMilestone(e,t,i){const a=this.getProject(e);if(!a)return;const s={id:Date.now().toString(),title:t,date:i,completed:!1};return a.milestones.push(s),a.updatedAt=new Date,this.saveProjects(),s}toggleMilestone(e,t){const i=this.getProject(e);if(!i)return!1;const a=i.milestones.find(s=>s.id===t);return a?(a.completed=!a.completed,i.updatedAt=new Date,this.saveProjects(),!0):!1}deleteMilestone(e,t){const i=this.getProject(e);if(!i)return!1;const a=i.milestones.findIndex(s=>s.id===t);return a===-1?!1:(i.milestones.splice(a,1),i.updatedAt=new Date,this.saveProjects(),!0)}addNote(e,t,i){const a=this.getProject(e);if(!a)return;const s={id:Date.now().toString(),content:t,createdAt:new Date,tags:i};return a.notes.push(s),a.updatedAt=new Date,this.saveProjects(),s}deleteNote(e,t){const i=this.getProject(e);if(!i)return!1;const a=i.notes.findIndex(s=>s.id===t);return a===-1?!1:(i.notes.splice(a,1),i.updatedAt=new Date,this.saveProjects(),!0)}addQuestion(e,t){const i=this.getProject(e);return i?(i.questions.push(t),i.updatedAt=new Date,this.saveProjects(),!0):!1}deleteQuestion(e,t){const i=this.getProject(e);return!i||t<0||t>=i.questions.length?!1:(i.questions.splice(t,1),i.updatedAt=new Date,this.saveProjects(),!0)}}class Q{constructor(e){o(this,"form");o(this,"descriptionInput");o(this,"categorySelect");o(this,"dueDateInput");o(this,"locationInput");o(this,"tagsInput");o(this,"effortLevelSelect");o(this,"prioritySelect");o(this,"isHabitCheckbox");o(this,"intentionTimeInput");o(this,"intentionLocationInput");o(this,"intentionDurationInput");o(this,"stackAfterHabitSelect");o(this,"categorySuggestion");o(this,"suggestedCategorySpan");o(this,"quickCategoryBtns");o(this,"categorizationEngine");o(this,"onSubmit");o(this,"selectedQuickCategory",null);o(this,"debounceTimer",null);this.onSubmit=e.onSubmit,this.categorizationEngine=e.categorizationEngine,this.form=document.getElementById("item-form"),this.descriptionInput=document.getElementById("description-input"),this.categorySelect=document.getElementById("category-select"),this.dueDateInput=document.getElementById("due-date-input"),this.locationInput=document.getElementById("location-input"),this.tagsInput=document.getElementById("tags-input"),this.effortLevelSelect=document.getElementById("effort-level-select"),this.prioritySelect=document.getElementById("priority-select"),this.isHabitCheckbox=document.getElementById("is-habit-checkbox"),this.intentionTimeInput=document.getElementById("intention-time"),this.intentionLocationInput=document.getElementById("intention-location"),this.intentionDurationInput=document.getElementById("intention-duration"),this.stackAfterHabitSelect=document.getElementById("stack-after-habit"),this.categorySuggestion=document.getElementById("category-suggestion"),this.suggestedCategorySpan=document.getElementById("suggested-category"),this.quickCategoryBtns=document.querySelectorAll(".quick-cat-btn"),this.initialize()}initialize(){this.populateCategorySelect(),this.form.addEventListener("submit",this.handleSubmit.bind(this)),this.descriptionInput.addEventListener("input",this.handleDescriptionChange.bind(this)),this.quickCategoryBtns.forEach(e=>{e.addEventListener("click",()=>this.handleQuickCategoryClick(e))})}populateCategorySelect(){for(const[e,t]of Object.entries(S)){const i=document.createElement("option");i.value=e,i.textContent=t.name,this.categorySelect.appendChild(i)}}handleQuickCategoryClick(e){const t=e.dataset.category;this.selectedQuickCategory===t?(this.selectedQuickCategory=null,e.classList.remove("selected")):(this.quickCategoryBtns.forEach(i=>i.classList.remove("selected")),this.selectedQuickCategory=t,e.classList.add("selected")),this.descriptionInput.focus()}handleDescriptionChange(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>this.updateCategorySuggestion(),100)}updateCategorySuggestion(){const e=this.descriptionInput.value.trim();if(e.length>=1&&!this.selectedQuickCategory){const t=this.categorizationEngine.categorize(e),i=S[t];this.suggestedCategorySpan.textContent=i.name,this.suggestedCategorySpan.style.backgroundColor=i.color,this.suggestedCategorySpan.style.color=this.getContrastColor(i.color),this.categorySuggestion.style.display="block"}else this.categorySuggestion.style.display="none"}getContrastColor(e){const t=parseInt(e.slice(1,3),16),i=parseInt(e.slice(3,5),16),a=parseInt(e.slice(5,7),16);return(.299*t+.587*i+.114*a)/255>.5?"#000000":"#ffffff"}async handleSubmit(e){e.preventDefault();const t=this.descriptionInput.value.trim();if(!t)return;const i=this.intentionTimeInput.value||this.intentionLocationInput.value||this.intentionDurationInput.value?{time:this.intentionTimeInput.value||void 0,location:this.intentionLocationInput.value.trim()||void 0,duration:this.intentionDurationInput.value?parseInt(this.intentionDurationInput.value):void 0}:void 0,a=this.stackAfterHabitSelect.value?{afterHabitId:this.stackAfterHabitSelect.value}:void 0,s={description:t,category:this.selectedQuickCategory||(this.categorySelect.value?this.categorySelect.value:void 0),dueDate:this.dueDateInput.value?new Date(this.dueDateInput.value):void 0,location:this.locationInput.value.trim()||void 0,tags:this.tagsInput.value?this.tagsInput.value.split(",").map(n=>n.trim()).filter(n=>n):void 0,effortLevel:this.effortLevelSelect.value||void 0,priority:this.prioritySelect.value||"normal",isHabit:this.isHabitCheckbox.checked,implementationIntention:i,habitStack:a};try{await this.onSubmit(s),this.resetForm()}catch(n){console.error("Failed to create item:",n)}}resetForm(){this.form.reset(),this.categorySuggestion.style.display="none",this.selectedQuickCategory=null,this.quickCategoryBtns.forEach(e=>e.classList.remove("selected")),this.descriptionInput.focus()}focus(){this.descriptionInput.focus()}}class J{constructor(e){o(this,"filterManager");o(this,"options");this.options=e,this.filterManager=new N}render(e){const t=document.createElement("div");return t.className="item-card",t.dataset.category=e.category,t.dataset.id=e.id,t.setAttribute("role","listitem"),e.type==="note"&&t.classList.add("note"),e.completed&&t.classList.add("completed"),this.filterManager.isOverdue(e)&&t.classList.add("overdue"),t.innerHTML=this.buildCardHTML(e),this.attachEventListeners(t,e),t}buildCardHTML(e){const t=S[e.category],i=this.filterManager.isOverdue(e);let a="";if(e.type==="task"&&(a+=`
        <input 
          type="checkbox" 
          class="item-checkbox" 
          ${e.completed?"checked":""}
          aria-label="Mark ${e.completed?"incomplete":"complete"}"
        >
      `),a+=`
      <div class="item-content">
        <div class="item-description">${this.escapeHtml(e.description)}</div>
        <div class="item-meta">
          <span class="item-category" style="background-color: ${t.color}; color: ${this.getContrastColor(t.color)}">
            ${t.name}
          </span>
    `,e.dueDate){const s=this.formatDate(e.dueDate);a+=`<span class="item-due-date">${i?"⚠️ ":"📅 "}${s}</span>`}if(e.location&&(a+=`<span class="item-location">📍 ${this.escapeHtml(e.location)}</span>`),a+="</div>",e.tags&&e.tags.length>0){a+='<div class="item-tags">';for(const s of e.tags)a+=`<span class="item-tag">#${this.escapeHtml(s)}</span>`;a+="</div>"}return a+="</div>",a+=`
      <div class="item-actions">
        <button class="edit-btn" aria-label="Edit item">Edit</button>
        <button class="delete-btn" aria-label="Delete item">Delete</button>
      </div>
    `,a}attachEventListeners(e,t){const i=e.querySelector(".item-checkbox");i&&i.addEventListener("change",()=>{this.options.onComplete(t.id)}),e.querySelector(".edit-btn").addEventListener("click",()=>{this.options.onEdit(t)}),e.querySelector(".delete-btn").addEventListener("click",()=>{this.options.onDelete(t.id)})}formatDate(e){const t=new Date(e);return t.toLocaleDateString("en-US",{month:"short",day:"numeric",year:t.getFullYear()!==new Date().getFullYear()?"numeric":void 0})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}getContrastColor(e){const t=parseInt(e.slice(1,3),16),i=parseInt(e.slice(3,5),16),a=parseInt(e.slice(5,7),16);return(.299*t+.587*i+.114*a)/255>.5?"#000000":"#ffffff"}}class X{constructor(e){o(this,"tasksContainer");o(this,"knowledgeContainer");o(this,"tasksEmptyState");o(this,"knowledgeEmptyState");o(this,"searchInput");o(this,"categoryFilter");o(this,"statusFilter");o(this,"sortOption");o(this,"filterManager");o(this,"itemCard");o(this,"options");o(this,"items",[]);o(this,"draggedItem",null);this.options=e,this.filterManager=new N,this.itemCard=new J({onComplete:e.onComplete,onEdit:e.onEdit,onDelete:e.onDelete}),this.tasksContainer=document.getElementById("items-list"),this.tasksEmptyState=document.getElementById("empty-state"),this.knowledgeContainer=document.getElementById("knowledge-list"),this.knowledgeEmptyState=document.getElementById("knowledge-empty-state"),this.searchInput=document.getElementById("search-input"),this.categoryFilter=document.getElementById("filter-category"),this.statusFilter=document.getElementById("filter-status"),this.sortOption=document.getElementById("sort-option"),this.initialize()}initialize(){this.populateCategoryFilter(),this.searchInput.addEventListener("input",this.handleFilterChange.bind(this)),this.categoryFilter.addEventListener("change",this.handleFilterChange.bind(this)),this.statusFilter.addEventListener("change",this.handleFilterChange.bind(this)),this.sortOption.addEventListener("change",this.handleFilterChange.bind(this))}populateCategoryFilter(){for(const[e,t]of Object.entries(S)){const i=document.createElement("option");i.value=e,i.textContent=t.name,this.categoryFilter.appendChild(i)}}handleFilterChange(){this.render()}getFilterCriteria(){const e={};return this.categoryFilter.value&&(e.category=this.categoryFilter.value),this.statusFilter.value==="completed"?e.completed=!0:this.statusFilter.value==="incomplete"&&(e.completed=!1),this.searchInput.value.trim()&&(e.searchQuery=this.searchInput.value.trim()),e}getSortSettings(){const e=this.sortOption.value;return{option:e,direction:e==="createdAt"?"desc":"asc"}}setupDragAndDrop(e,t){e.draggable=!0,e.addEventListener("dragstart",i=>{var a;this.draggedItem=e,e.classList.add("dragging"),(a=i.dataTransfer)==null||a.setData("text/plain",e.dataset.id||"")}),e.addEventListener("dragend",()=>{e.classList.remove("dragging"),this.draggedItem=null,this.tasksContainer.querySelectorAll(".drag-over").forEach(i=>i.classList.remove("drag-over")),this.knowledgeContainer.querySelectorAll(".drag-over").forEach(i=>i.classList.remove("drag-over"))}),e.addEventListener("dragover",i=>{i.preventDefault(),this.draggedItem&&this.draggedItem!==e&&e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",i=>{var a,s;if(i.preventDefault(),e.classList.remove("drag-over"),this.draggedItem&&this.draggedItem!==e){const n=Array.from(t.querySelectorAll(".item-card")),r=n.indexOf(this.draggedItem),l=n.indexOf(e);r<l?(a=e.parentNode)==null||a.insertBefore(this.draggedItem,e.nextSibling):(s=e.parentNode)==null||s.insertBefore(this.draggedItem,e)}})}async refresh(){this.items=await this.options.getItems(),this.render()}setItems(e){this.items=e,this.render()}render(){const e=this.getFilterCriteria();let t=this.filterManager.applyFilters(this.items,e);const{option:i,direction:a}=this.getSortSettings();t=this.filterManager.sort(t,i,a);const s=t.filter(r=>r.category!==u.KNOWLEDGE_HUB),n=t.filter(r=>r.category===u.KNOWLEDGE_HUB);this.tasksContainer.querySelectorAll(".item-card").forEach(r=>r.remove()),this.knowledgeContainer.querySelectorAll(".item-card").forEach(r=>r.remove()),this.renderTasksColumn(s),this.renderKnowledgeColumn(n)}renderTasksColumn(e){const t=this.searchInput.value.trim()||this.categoryFilter.value||this.statusFilter.value,i=this.items.filter(a=>a.category!==u.KNOWLEDGE_HUB);if(e.length===0)this.tasksEmptyState.style.display="block",t&&i.length>0?this.tasksEmptyState.innerHTML=`
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" fill="#f0f0f0"/>
              <path d="M25 40 L35 50 L55 30" stroke="#ddd" stroke-width="4" fill="none"/>
            </svg>
          </div>
          <h3>No matches found</h3>
          <p>Try adjusting your filters</p>
        `:this.tasksEmptyState.innerHTML=`
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#f0f0f0"/>
              <rect x="35" y="40" width="50" height="8" rx="4" fill="#ddd"/>
              <rect x="35" y="55" width="40" height="8" rx="4" fill="#ddd"/>
              <rect x="35" y="70" width="45" height="8" rx="4" fill="#ddd"/>
              <circle cx="25" cy="44" r="4" fill="#9370DB"/>
              <circle cx="25" cy="59" r="4" fill="#32CD32"/>
              <circle cx="25" cy="74" r="4" fill="#4169E1"/>
            </svg>
          </div>
          <h3>No tasks yet!</h3>
          <p>Add your first task above to get started.</p>
          <p class="empty-hint">💡 Try typing "gym tomorrow" or "call mom"</p>
        `;else{this.tasksEmptyState.style.display="none";for(const a of e){const s=this.itemCard.render(a);this.setupDragAndDrop(s,this.tasksContainer),this.tasksContainer.appendChild(s)}}}renderKnowledgeColumn(e){const t=this.searchInput.value.trim()||this.categoryFilter.value||this.statusFilter.value,i=this.items.filter(a=>a.category===u.KNOWLEDGE_HUB);if(e.length===0)this.knowledgeEmptyState.style.display="block",t&&i.length>0?this.knowledgeEmptyState.innerHTML=`
          <div class="empty-illustration">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="25" fill="#e0f2f1"/>
              <path d="M20 30 L27 37 L40 24" stroke="#20B2AA" stroke-width="3" fill="none"/>
            </svg>
          </div>
          <p>No matching notes</p>
        `:this.knowledgeEmptyState.innerHTML=`
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" fill="#e0f2f1"/>
              <circle cx="40" cy="35" r="12" fill="#20B2AA"/>
              <rect x="38" y="50" width="4" height="12" rx="2" fill="#20B2AA"/>
            </svg>
          </div>
          <p>Save notes, ideas & references here</p>
        `;else{this.knowledgeEmptyState.style.display="none";for(const a of e){const s=this.itemCard.render(a);this.setupDragAndDrop(s,this.knowledgeContainer),this.knowledgeContainer.appendChild(s)}}}}const Z={2024:[{date:"01-01",name:"New Year's Day"},{date:"01-26",name:"Australia Day"},{date:"03-29",name:"Good Friday"},{date:"03-30",name:"Easter Saturday"},{date:"04-01",name:"Easter Monday"},{date:"04-25",name:"Anzac Day"},{date:"06-10",name:"King's Birthday"},{date:"08-05",name:"Bank Holiday"},{date:"12-25",name:"Christmas Day"},{date:"12-26",name:"Boxing Day"}],2025:[{date:"01-01",name:"New Year's Day"},{date:"01-27",name:"Australia Day (observed)"},{date:"04-18",name:"Good Friday"},{date:"04-19",name:"Easter Saturday"},{date:"04-21",name:"Easter Monday"},{date:"04-25",name:"Anzac Day"},{date:"06-09",name:"King's Birthday"},{date:"08-04",name:"Bank Holiday"},{date:"12-25",name:"Christmas Day"},{date:"12-26",name:"Boxing Day"}],2026:[{date:"01-01",name:"New Year's Day"},{date:"01-26",name:"Australia Day"},{date:"04-03",name:"Good Friday"},{date:"04-04",name:"Easter Saturday"},{date:"04-06",name:"Easter Monday"},{date:"04-27",name:"Anzac Day (observed)"},{date:"06-08",name:"King's Birthday"},{date:"08-03",name:"Bank Holiday"},{date:"12-25",name:"Christmas Day"},{date:"12-28",name:"Boxing Day (observed)"}]};class ee{constructor(e){o(this,"container");o(this,"getItems");o(this,"onTaskClick");o(this,"currentDate");o(this,"minDate");o(this,"maxDate");o(this,"expandedDate",null);this.container=document.getElementById("calendar-container"),this.getItems=e.getItems,this.onTaskClick=e.onTaskClick,this.currentDate=new Date,this.currentDate.setDate(1),this.currentDate.setHours(0,0,0,0),this.minDate=new Date,this.minDate.setMonth(this.minDate.getMonth()-12),this.minDate.setDate(1),this.maxDate=new Date,this.maxDate.setMonth(this.maxDate.getMonth()+12),this.maxDate.setDate(1)}async refresh(){await this.render()}getHolidayForDate(e){const t=e.getFullYear(),i=Z[t];if(!i)return null;const a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0"),n=`${a}-${s}`;return i.find(r=>r.date===n)||null}async render(){const t=(await this.getItems()).filter(i=>i.dueDate||i.createdAt);this.container.innerHTML=`
      <div class="calendar-header">
        <button class="calendar-nav-btn" id="prev-month" ${this.canGoPrev()?"":"disabled"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>
        <h3 class="calendar-month-title">${this.formatMonthYear(this.currentDate)}</h3>
        <button class="calendar-nav-btn" id="next-month" ${this.canGoNext()?"":"disabled"}>
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="calendar-weekdays">
        <div class="weekday">Mon</div>
        <div class="weekday">Tue</div>
        <div class="weekday">Wed</div>
        <div class="weekday">Thu</div>
        <div class="weekday">Fri</div>
        <div class="weekday weekend">Sat</div>
        <div class="weekday weekend">Sun</div>
      </div>
      <div class="calendar-grid">
        ${this.renderCalendarDays(t)}
      </div>
      ${this.renderExpandedDay(t)}
      <div class="calendar-legend">
        <div class="legend-section">
          <div class="legend-item">
            <span class="legend-color" style="background-color: #DC143C"></span>
            <span class="legend-label">🇦🇺 Public Holiday</span>
          </div>
          <div class="legend-item">
            <span class="legend-color weekend-indicator"></span>
            <span class="legend-label">Weekend</span>
          </div>
        </div>
        <div class="legend-section">
          ${this.renderCategoryLegend()}
        </div>
      </div>
    `,this.attachEventListeners(t)}renderCalendarDays(e){const t=this.currentDate.getFullYear(),i=this.currentDate.getMonth(),a=new Date(t,i,1).getDay(),s=a===0?6:a-1,n=new Date(t,i+1,0).getDate(),r=new Date(t,i,0).getDate(),l=new Date;l.setHours(0,0,0,0);let p="";for(let v=s-1;v>=0;v--){const h=r-v,d=new Date(t,i-1,h).getDay();p+=`<div class="calendar-day other-month ${d===0||d===6?"weekend":""}"><span class="day-number">${h}</span></div>`}for(let v=1;v<=n;v++){const h=new Date(t,i,v);h.setHours(0,0,0,0);const m=h.getDay(),d=m===0||m===6,y=h.getTime()===l.getTime(),I=this.getItemsForDate(e,h),D=this.getHolidayForDate(h),C=this.expandedDate&&this.expandedDate.getTime()===h.getTime(),f=["calendar-day"];d&&f.push("weekend"),y&&f.push("today"),(I.length>0||D)&&f.push("has-tasks"),D&&f.push("holiday"),C&&f.push("expanded");const k=I.length>3||I.length>2&&D;p+=`
        <div class="${f.join(" ")}" data-date="${h.toISOString()}" data-clickable="${k||I.length>0||D}">
          <span class="day-number">${v}</span>
          ${D?`<div class="calendar-holiday" title="${D.name}">🇦🇺 ${this.truncate(D.name,15)}</div>`:""}
          <div class="day-tasks">
            ${this.renderDayTasks(I,D?2:3)}
          </div>
          ${k?`<div class="calendar-task-more">View all (${I.length})</div>`:""}
        </div>
      `}const g=s+n,w=g%7===0?0:7-g%7;for(let v=1;v<=w;v++){const m=new Date(t,i+1,v).getDay();p+=`<div class="calendar-day other-month ${m===0||m===6?"weekend":""}"><span class="day-number">${v}</span></div>`}return p}renderExpandedDay(e){if(!this.expandedDate)return"";const t=this.getItemsForDate(e,this.expandedDate),i=this.getHolidayForDate(this.expandedDate),a=this.expandedDate.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),s=this.expandedDate.getDay(),n=s===0||s===6;return`
      <div class="expanded-day-panel ${n?"weekend-panel":""}">
        <div class="expanded-day-header">
          <div class="expanded-day-title">
            <h4>${a}</h4>
            ${n?'<span class="weekend-badge">Weekend</span>':""}
          </div>
          <button class="close-expanded-btn" id="close-expanded" title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        ${i?`
          <div class="expanded-holiday">
            <div class="holiday-icon">🇦🇺</div>
            <div class="holiday-content">
              <strong>${i.name}</strong>
              <span>Australian Public Holiday</span>
            </div>
          </div>
        `:""}
        <div class="expanded-day-content">
          <div class="expanded-day-stats">
            <div class="stat-badge">
              <span class="stat-number">${t.length}</span>
              <span class="stat-label">${t.length===1?"Task":"Tasks"}</span>
            </div>
            <div class="stat-badge">
              <span class="stat-number">${t.filter(r=>r.completed).length}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat-badge">
              <span class="stat-number">${t.filter(r=>!r.completed).length}</span>
              <span class="stat-label">Remaining</span>
            </div>
          </div>
          <div class="expanded-day-tasks">
            ${t.length>0?t.map(r=>this.renderExpandedTask(r)).join(""):'<div class="no-tasks"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="25" fill="#f0f0f0"/><path d="M20 30h20M30 20v20" stroke="#ddd" stroke-width="3" stroke-linecap="round"/></svg><p>No tasks for this day</p></div>'}
          </div>
        </div>
      </div>
    `}renderExpandedTask(e){const t=S[e.category];return`
      <div class="expanded-task ${e.completed?"completed":""}" data-item-id="${e.id}">
        <div class="expanded-task-indicator" style="background-color: ${t.color};"></div>
        <div class="expanded-task-checkbox">
          ${e.completed?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'}
        </div>
        <div class="expanded-task-content">
          <div class="expanded-task-desc">${e.description}</div>
          <div class="expanded-task-meta">
            <span class="expanded-task-category" style="background-color: ${t.color}20; color: ${t.color};">
              ${t.name}
            </span>
            ${e.dueDate?`<span class="expanded-task-due">📅 ${new Date(e.dueDate).toLocaleDateString("en-AU",{day:"numeric",month:"short"})}</span>`:""}
            ${e.location?`<span class="expanded-task-location">📍 ${e.location}</span>`:""}
          </div>
        </div>
        <div class="expanded-task-actions">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    `}getItemsForDate(e,t){return e.filter(i=>{const a=i.dueDate?new Date(i.dueDate):new Date(i.createdAt);return a.setHours(0,0,0,0),a.getTime()===t.getTime()})}renderDayTasks(e,t){return e.length===0?"":e.slice(0,t).map(a=>{const s=S[a.category];return`
        <div class="calendar-task ${a.completed?"completed":""}" 
             style="background-color: ${s.color}20; border-left: 3px solid ${s.color};"
             data-item-id="${a.id}"
             title="${a.description}">
          ${this.truncate(a.description,18)}
        </div>
      `}).join("")}renderCategoryLegend(){return Object.entries(S).map(([e,t])=>`
      <div class="legend-item">
        <span class="legend-color" style="background-color: ${t.color}"></span>
        <span class="legend-label">${t.name}</span>
      </div>
    `).join("")}truncate(e,t){return e.length>t?e.substring(0,t)+"...":e}formatMonthYear(e){return e.toLocaleDateString("en-US",{month:"long",year:"numeric"})}canGoPrev(){const e=new Date(this.currentDate);return e.setMonth(e.getMonth()-1),e>=this.minDate}canGoNext(){const e=new Date(this.currentDate);return e.setMonth(e.getMonth()+1),e<=this.maxDate}attachEventListeners(e){const t=document.getElementById("prev-month"),i=document.getElementById("next-month"),a=document.getElementById("close-expanded");t==null||t.addEventListener("click",()=>{this.canGoPrev()&&(this.currentDate.setMonth(this.currentDate.getMonth()-1),this.expandedDate=null,this.refresh())}),i==null||i.addEventListener("click",()=>{this.canGoNext()&&(this.currentDate.setMonth(this.currentDate.getMonth()+1),this.expandedDate=null,this.refresh())}),a==null||a.addEventListener("click",()=>{this.expandedDate=null,this.refresh()}),this.container.querySelectorAll('.calendar-day[data-clickable="true"]').forEach(r=>{r.addEventListener("click",l=>{if(l.target.closest(".calendar-task"))return;const g=r.getAttribute("data-date");g&&(this.expandedDate=new Date(g),this.refresh())})}),this.container.querySelectorAll(".calendar-task[data-item-id], .expanded-task[data-item-id]").forEach(r=>{r.addEventListener("click",async l=>{l.stopPropagation();const p=r.getAttribute("data-item-id");if(p&&this.onTaskClick){const g=e.find(w=>w.id===p);g&&this.onTaskClick(g)}})})}}class te{static parseProjectText(e){const t={},i=e.split(`
`).filter(n=>n.trim());i.length>0&&(t.title=i[0].trim().replace(/^[#*\-]+\s*/,"")),i.length>1&&(t.description=i.slice(1).join(" ").trim().substring(0,500));const a=e.toLowerCase();a.includes("fellowship")?t.category="fellowship":a.includes("scholarship")?t.category="scholarship":a.includes("speaker")||a.includes("speaking")||a.includes("presentation")?t.category="speaking":a.includes("leader")||a.includes("leadership")?t.category="leadership":t.category="other",t.applicationOpenDate=this.extractDate(e,["open","opens","opening","applications open"]),t.applicationDeadline=this.extractDate(e,["deadline","due","close","closes","closing","submit by","applications close"]),t.notificationDate=this.extractDate(e,["notification","notify","announce","results","decision"]),t.programStartDate=this.extractDate(e,["start","begins","commence","program start","fellowship start"]),t.programEndDate=this.extractDate(e,["end","finish","conclude","program end","fellowship end"]);const s=e.match(/https?:\/\/[^\s]+/);return s&&(t.url=s[0]),a.includes("urgent")||a.includes("high priority")||a.includes("important")?t.priority="high":a.includes("low priority")?t.priority="low":t.priority="medium",t}static extractDate(e,t){const i=e.toLowerCase();for(const a of t){const s=i.indexOf(a);if(s===-1)continue;const n=Math.max(0,s-50),r=Math.min(e.length,s+a.length+100),l=e.substring(n,r),p=this.findDateInText(l);if(p)return p}}static findDateInText(e){let t=e.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);if(t){const s=parseInt(t[1]),n=parseInt(t[2])-1,r=parseInt(t[3]);return new Date(r,n,s)}if(t=e.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/),t){const s=parseInt(t[1]),n=parseInt(t[2])-1,r=parseInt(t[3]);return new Date(s,n,r)}const i=["january","february","march","april","may","june","july","august","september","october","november","december"],a=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];for(let s=0;s<i.length;s++){const n=[new RegExp(`${i[s]}\\s+(\\d{1,2}),?\\s+(\\d{4})`,"i"),new RegExp(`${a[s]}\\s+(\\d{1,2}),?\\s+(\\d{4})`,"i"),new RegExp(`(\\d{1,2})\\s+${i[s]}\\s+(\\d{4})`,"i"),new RegExp(`(\\d{1,2})\\s+${a[s]}\\s+(\\d{4})`,"i")];for(const r of n){const l=e.match(r);if(l){const p=parseInt(l[1]),g=parseInt(l[2]);return new Date(g,s,p)}}}}}class ie{constructor(e){o(this,"container");o(this,"projectManager");o(this,"selectedProject",null);this.container=document.getElementById("projects-container"),this.projectManager=e.projectManager}render(){const e=this.projectManager.getAllProjects();this.container.innerHTML=`
      <div class="projects-view">
        <div class="projects-header">
          <div class="projects-title">
            <h2>📋 Long-Term Projects & Applications</h2>
            <p>Track fellowships, scholarships, and speaking opportunities</p>
          </div>
          <button class="btn-primary" id="add-project-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Project
          </button>
        </div>

        ${this.renderTimeline(e)}
        
        <div class="projects-grid">
          ${e.length>0?e.map(t=>this.renderProjectCard(t)).join(""):this.renderEmptyState()}
        </div>

        ${this.selectedProject?this.renderProjectDetail(this.selectedProject):""}
      </div>

      <!-- Add Project Modal -->
      <div class="project-modal" id="add-project-modal" style="display: none;">
        <div class="project-modal-content">
          <div class="project-modal-header">
            <h2>Add New Project</h2>
            <button class="close-modal-btn" id="close-add-modal-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="project-modal-body">
            <div class="smart-paste-section">
              <label>📋 Smart Paste</label>
              <p class="help-text">Paste project details and we'll automatically extract the information</p>
              <textarea id="smart-paste-input" placeholder="Paste project details here (title, description, dates, URL, etc.)..." rows="6"></textarea>
              <button class="btn-secondary" id="parse-btn">🔍 Parse Information</button>
            </div>

            <div class="form-divider">
              <span>OR ENTER MANUALLY</span>
            </div>

            <form id="add-project-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="project-title">Title *</label>
                  <input type="text" id="project-title" required placeholder="e.g., Churchill Fellowship">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-description">Description *</label>
                  <textarea id="project-description" required rows="3" placeholder="Brief description of the project..."></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-category">Category *</label>
                  <select id="project-category" required>
                    <option value="fellowship">Fellowship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="speaking">Speaking</option>
                    <option value="leadership">Leadership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="project-priority">Priority</label>
                  <select id="project-priority">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div class="form-section-title">📅 Timeline</div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-open-date">Applications Open</label>
                  <input type="date" id="project-open-date">
                </div>
                <div class="form-group">
                  <label for="project-deadline">Application Deadline</label>
                  <input type="date" id="project-deadline">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-notification">Notification Date</label>
                  <input type="date" id="project-notification">
                </div>
                <div class="form-group">
                  <label for="project-url">Website URL</label>
                  <input type="url" id="project-url" placeholder="https://...">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-start">Program Start</label>
                  <input type="date" id="project-start">
                </div>
                <div class="form-group">
                  <label for="project-end">Program End</label>
                  <input type="date" id="project-end">
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" id="cancel-add-btn">Cancel</button>
                <button type="submit" class="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Project Modal -->
      <div class="project-modal" id="edit-project-modal" style="display: none;">
        <div class="project-modal-content">
          <div class="project-modal-header">
            <h2>Edit Project</h2>
            <button class="close-modal-btn" id="close-edit-modal-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="project-modal-body">
            <form id="edit-project-form">
              <input type="hidden" id="edit-project-id">
              
              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-title">Title *</label>
                  <input type="text" id="edit-project-title" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-description">Description *</label>
                  <textarea id="edit-project-description" required rows="3"></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-status">Status</label>
                  <select id="edit-project-status">
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="edit-project-progress">Progress (0-100)</label>
                  <input type="number" id="edit-project-progress" min="0" max="100">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-category">Category *</label>
                  <select id="edit-project-category" required>
                    <option value="fellowship">Fellowship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="speaking">Speaking</option>
                    <option value="leadership">Leadership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="edit-project-priority">Priority</label>
                  <select id="edit-project-priority">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div class="form-section-title">📅 Timeline</div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-open-date">Applications Open</label>
                  <input type="date" id="edit-project-open-date">
                </div>
                <div class="form-group">
                  <label for="edit-project-deadline">Application Deadline</label>
                  <input type="date" id="edit-project-deadline">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-notification">Notification Date</label>
                  <input type="date" id="edit-project-notification">
                </div>
                <div class="form-group">
                  <label for="edit-project-url">Website URL</label>
                  <input type="url" id="edit-project-url" placeholder="https://...">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-start">Program Start</label>
                  <input type="date" id="edit-project-start">
                </div>
                <div class="form-group">
                  <label for="edit-project-end">Program End</label>
                  <input type="date" id="edit-project-end">
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" id="cancel-edit-btn">Cancel</button>
                <button type="submit" class="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,this.attachEventListeners()}renderTimeline(e){const t=new Date,i=new Date(t.getTime()+4320*60*60*1e3),a=[];return e.forEach(s=>{s.applicationOpenDate&&s.applicationOpenDate>=t&&s.applicationOpenDate<=i&&a.push({date:s.applicationOpenDate,project:s,type:"open",label:"Opens"}),s.applicationDeadline&&s.applicationDeadline>=t&&s.applicationDeadline<=i&&a.push({date:s.applicationDeadline,project:s,type:"deadline",label:"Deadline"}),s.notificationDate&&s.notificationDate>=t&&s.notificationDate<=i&&a.push({date:s.notificationDate,project:s,type:"notification",label:"Notification"}),s.programStartDate&&s.programStartDate>=t&&s.programStartDate<=i&&a.push({date:s.programStartDate,project:s,type:"start",label:"Starts"})}),a.sort((s,n)=>s.date.getTime()-n.date.getTime()),a.length===0?`
        <div class="timeline-section">
          <h3>📅 Upcoming Timeline</h3>
          <div class="timeline-empty">
            <p>No upcoming deadlines in the next 6 months</p>
          </div>
        </div>
      `:`
      <div class="timeline-section">
        <h3>📅 Upcoming Timeline (Next 6 Months)</h3>
        <div class="timeline-container">
          ${a.map(s=>this.renderTimelineEvent(s)).join("")}
        </div>
      </div>
    `}renderTimelineEvent(e){const t=Math.ceil((e.date.getTime()-new Date().getTime())/864e5),i={open:"#4169E1",deadline:"#DC143C",notification:"#FFA500",start:"#32CD32"};return`
      <div class="timeline-event" data-type="${e.type}">
        <div class="timeline-date" style="border-color: ${i[e.type]}">
          <div class="timeline-day">${e.date.getDate()}</div>
          <div class="timeline-month">${e.date.toLocaleDateString("en-US",{month:"short"})}</div>
        </div>
        <div class="timeline-content">
          <div class="timeline-project-name">${e.project.title}</div>
          <div class="timeline-event-type" style="color: ${i[e.type]}">${e.label}</div>
          <div class="timeline-countdown">${t} days away</div>
        </div>
      </div>
    `}renderProjectCard(e){const t={planning:"#9370DB","in-progress":"#4169E1",submitted:"#FFA500",completed:"#32CD32",rejected:"#DC143C",accepted:"#32CD32"},i={fellowship:"🎓",scholarship:"📚",speaking:"🎤",leadership:"👥",other:"📋"},a=e.applicationDeadline,s=a?Math.ceil((a.getTime()-new Date().getTime())/(1e3*60*60*24)):null,n=s!==null&&s<=14&&s>=0;return`
      <div class="project-card ${n?"urgent":""}" data-id="${e.id}">
        <div class="project-card-header">
          <div class="project-icon">${i[e.category]}</div>
          <div class="project-status" style="background: ${t[e.status]}">
            ${e.status.replace("-"," ")}
          </div>
        </div>
        
        <h3 class="project-title">${e.title}</h3>
        <p class="project-description">${e.description}</p>
        
        <div class="project-progress">
          <div class="progress-header">
            <span>Progress</span>
            <span class="progress-value">${e.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${e.progress}%; background: ${t[e.status]}"></div>
          </div>
        </div>

        ${a?`
          <div class="project-deadline ${n?"urgent":""}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Deadline: ${a.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
            ${s!==null&&s>=0?`<span class="days-left">(${s}d)</span>`:""}
          </div>
        `:""}

        <div class="project-meta">
          <span class="project-notes-count">📝 ${e.notes.length} notes</span>
          <span class="project-milestones-count">✓ ${e.milestones.filter(r=>r.completed).length}/${e.milestones.length} milestones</span>
        </div>

        <div class="project-actions">
          <button class="btn-view" data-id="${e.id}">View Details</button>
          <button class="btn-edit" data-id="${e.id}">Edit</button>
          <button class="btn-delete" data-id="${e.id}">Delete</button>
        </div>
      </div>
    `}renderProjectDetail(e){return`
      <div class="project-detail-modal" id="project-detail-modal">
        <div class="project-detail-content">
          <div class="project-detail-header">
            <h2>${e.title}</h2>
            <button class="close-detail-btn" id="close-detail-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="project-detail-body">
            <div class="detail-section">
              <h3>📋 Overview</h3>
              <p>${e.description}</p>
              ${e.url?`<a href="${e.url}" target="_blank" class="project-link">🔗 Visit Website</a>`:""}
            </div>

            <div class="detail-section">
              <h3>📅 Timeline</h3>
              <div class="timeline-dates">
                ${e.applicationOpenDate?`<div class="date-item"><strong>Opens:</strong> ${e.applicationOpenDate.toLocaleDateString()}</div>`:""}
                ${e.applicationDeadline?`<div class="date-item"><strong>Deadline:</strong> ${e.applicationDeadline.toLocaleDateString()}</div>`:""}
                ${e.notificationDate?`<div class="date-item"><strong>Notification:</strong> ${e.notificationDate.toLocaleDateString()}</div>`:""}
                ${e.programStartDate?`<div class="date-item"><strong>Program Starts:</strong> ${e.programStartDate.toLocaleDateString()}</div>`:""}
                ${e.programEndDate?`<div class="date-item"><strong>Program Ends:</strong> ${e.programEndDate.toLocaleDateString()}</div>`:""}
              </div>
            </div>

            <div class="detail-section">
              <div class="section-header-with-action">
                <h3>✓ Milestones</h3>
                <button class="btn-small" id="add-milestone-btn">+ Add</button>
              </div>
              <div class="milestones-list">
                ${e.milestones.length>0?e.milestones.map(t=>`
                  <div class="milestone-item ${t.completed?"completed":""}">
                    <input type="checkbox" ${t.completed?"checked":""} data-milestone-id="${t.id}" class="milestone-checkbox">
                    <div class="milestone-content">
                      <span class="milestone-title">${t.title}</span>
                      <span class="milestone-date">${t.date.toLocaleDateString()}</span>
                    </div>
                    <button class="btn-icon-delete" data-milestone-id="${t.id}">×</button>
                  </div>
                `).join(""):'<p class="empty-message">No milestones yet</p>'}
              </div>
            </div>

            <div class="detail-section">
              <div class="section-header-with-action">
                <h3>📝 Notes</h3>
                <button class="btn-small" id="add-note-btn">+ Add</button>
              </div>
              <div class="notes-list">
                ${e.notes.length>0?e.notes.map(t=>`
                  <div class="note-item">
                    <div class="note-content">${t.content}</div>
                    <div class="note-meta">
                      <span>${t.createdAt.toLocaleDateString()}</span>
                      <button class="btn-icon-delete" data-note-id="${t.id}">×</button>
                    </div>
                  </div>
                `).join(""):'<p class="empty-message">No notes yet</p>'}
              </div>
            </div>

            <div class="detail-section">
              <div class="section-header-with-action">
                <h3>❓ Application Questions</h3>
                <button class="btn-small" id="add-question-btn">+ Add</button>
              </div>
              <div class="questions-list">
                ${e.questions.length>0?e.questions.map((t,i)=>`
                  <div class="question-item">
                    <span class="question-number">${i+1}.</span>
                    <span class="question-text">${t}</span>
                    <button class="btn-icon-delete" data-question-index="${i}">×</button>
                  </div>
                `).join(""):'<p class="empty-message">No questions yet</p>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}renderEmptyState(){return`
      <div class="projects-empty">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" fill="#f0f0f0"/>
          <path d="M40 50h40M40 60h30M40 70h35" stroke="#ddd" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <h3>No Projects Yet</h3>
        <p>Start tracking your fellowships, scholarships, and applications</p>
      </div>
    `}attachEventListeners(){const e=document.getElementById("add-project-btn");e==null||e.addEventListener("click",()=>this.showAddProjectModal());const t=document.getElementById("close-add-modal-btn");t==null||t.addEventListener("click",()=>this.hideAddProjectModal());const i=document.getElementById("cancel-add-btn");i==null||i.addEventListener("click",()=>this.hideAddProjectModal());const a=document.getElementById("parse-btn");a==null||a.addEventListener("click",()=>this.handleSmartParse());const s=document.getElementById("add-project-form");s==null||s.addEventListener("submit",f=>{f.preventDefault(),this.handleAddProject()});const n=document.getElementById("close-edit-modal-btn");n==null||n.addEventListener("click",()=>this.hideEditProjectModal());const r=document.getElementById("cancel-edit-btn");r==null||r.addEventListener("click",()=>this.hideEditProjectModal());const l=document.getElementById("edit-project-form");l==null||l.addEventListener("submit",f=>{f.preventDefault(),this.handleEditProject()}),this.container.querySelectorAll(".btn-view").forEach(f=>{f.addEventListener("click",k=>{const b=k.target.getAttribute("data-id");b&&this.showProjectDetail(b)})}),this.container.querySelectorAll(".btn-edit").forEach(f=>{f.addEventListener("click",k=>{const b=k.target.getAttribute("data-id");b&&this.showEditProjectModal(b)})}),this.container.querySelectorAll(".btn-delete").forEach(f=>{f.addEventListener("click",k=>{const b=k.target.getAttribute("data-id");b&&confirm("Delete this project?")&&(this.projectManager.deleteProject(b),this.render())})});const v=document.getElementById("close-detail-btn");v==null||v.addEventListener("click",()=>{this.selectedProject=null,this.render()}),this.container.querySelectorAll(".milestone-checkbox").forEach(f=>{f.addEventListener("change",k=>{const b=k.target.getAttribute("data-milestone-id");b&&this.selectedProject&&(this.projectManager.toggleMilestone(this.selectedProject.id,b),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render())})});const m=document.getElementById("add-milestone-btn");m==null||m.addEventListener("click",()=>this.showAddMilestoneForm());const d=document.getElementById("add-note-btn");d==null||d.addEventListener("click",()=>this.showAddNoteForm());const y=document.getElementById("add-question-btn");y==null||y.addEventListener("click",()=>this.showAddQuestionForm()),this.container.querySelectorAll("[data-milestone-id].btn-icon-delete").forEach(f=>{f.addEventListener("click",k=>{const b=k.target.getAttribute("data-milestone-id");b&&this.selectedProject&&(this.projectManager.deleteMilestone(this.selectedProject.id,b),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render())})}),this.container.querySelectorAll("[data-note-id].btn-icon-delete").forEach(f=>{f.addEventListener("click",k=>{const b=k.target.getAttribute("data-note-id");b&&this.selectedProject&&(this.projectManager.deleteNote(this.selectedProject.id,b),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render())})}),this.container.querySelectorAll("[data-question-index].btn-icon-delete").forEach(f=>{f.addEventListener("click",k=>{const b=parseInt(k.target.getAttribute("data-question-index")||"");!isNaN(b)&&this.selectedProject&&(this.projectManager.deleteQuestion(this.selectedProject.id,b),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render())})})}showAddProjectModal(){const e=document.getElementById("add-project-modal");e&&(e.style.display="flex")}hideAddProjectModal(){const e=document.getElementById("add-project-modal");e&&(e.style.display="none"),this.clearAddForm()}clearAddForm(){const e=document.getElementById("add-project-form");e&&e.reset();const t=document.getElementById("smart-paste-input");t&&(t.value="")}handleSmartParse(){const e=document.getElementById("smart-paste-input");if(!e||!e.value.trim())return;const t=te.parseProjectText(e.value);if(t.title){const i=document.getElementById("project-title");i&&(i.value=t.title)}if(t.description){const i=document.getElementById("project-description");i&&(i.value=t.description)}if(t.category){const i=document.getElementById("project-category");i&&(i.value=t.category)}if(t.priority){const i=document.getElementById("project-priority");i&&(i.value=t.priority)}if(t.applicationOpenDate){const i=document.getElementById("project-open-date");i&&(i.value=this.formatDateForInput(t.applicationOpenDate))}if(t.applicationDeadline){const i=document.getElementById("project-deadline");i&&(i.value=this.formatDateForInput(t.applicationDeadline))}if(t.notificationDate){const i=document.getElementById("project-notification");i&&(i.value=this.formatDateForInput(t.notificationDate))}if(t.programStartDate){const i=document.getElementById("project-start");i&&(i.value=this.formatDateForInput(t.programStartDate))}if(t.programEndDate){const i=document.getElementById("project-end");i&&(i.value=this.formatDateForInput(t.programEndDate))}if(t.url){const i=document.getElementById("project-url");i&&(i.value=t.url)}}formatDateForInput(e){const t=e.getFullYear(),i=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${i}-${a}`}handleAddProject(){const e=document.getElementById("project-title"),t=document.getElementById("project-description"),i=document.getElementById("project-category"),a=document.getElementById("project-priority"),s=document.getElementById("project-open-date"),n=document.getElementById("project-deadline"),r=document.getElementById("project-notification"),l=document.getElementById("project-start"),p=document.getElementById("project-end"),g=document.getElementById("project-url");if(!e.value.trim()||!t.value.trim()){alert("Please fill in title and description");return}this.projectManager.createProject({title:e.value.trim(),description:t.value.trim(),category:i.value,priority:a.value,applicationOpenDate:s.value?new Date(s.value):void 0,applicationDeadline:n.value?new Date(n.value):void 0,notificationDate:r.value?new Date(r.value):void 0,programStartDate:l.value?new Date(l.value):void 0,programEndDate:p.value?new Date(p.value):void 0,url:g.value.trim()||void 0}),this.hideAddProjectModal(),this.render()}showProjectDetail(e){this.selectedProject=this.projectManager.getProject(e)||null,this.render()}showEditProjectModal(e){const t=this.projectManager.getProject(e);if(!t)return;const i=document.getElementById("edit-project-id"),a=document.getElementById("edit-project-title"),s=document.getElementById("edit-project-description"),n=document.getElementById("edit-project-status"),r=document.getElementById("edit-project-progress"),l=document.getElementById("edit-project-category"),p=document.getElementById("edit-project-priority"),g=document.getElementById("edit-project-open-date"),w=document.getElementById("edit-project-deadline"),v=document.getElementById("edit-project-notification"),h=document.getElementById("edit-project-start"),m=document.getElementById("edit-project-end"),d=document.getElementById("edit-project-url");i&&(i.value=t.id),a&&(a.value=t.title),s&&(s.value=t.description),n&&(n.value=t.status),r&&(r.value=t.progress.toString()),l&&(l.value=t.category),p&&(p.value=t.priority),g&&t.applicationOpenDate&&(g.value=this.formatDateForInput(t.applicationOpenDate)),w&&t.applicationDeadline&&(w.value=this.formatDateForInput(t.applicationDeadline)),v&&t.notificationDate&&(v.value=this.formatDateForInput(t.notificationDate)),h&&t.programStartDate&&(h.value=this.formatDateForInput(t.programStartDate)),m&&t.programEndDate&&(m.value=this.formatDateForInput(t.programEndDate)),d&&t.url&&(d.value=t.url);const y=document.getElementById("edit-project-modal");y&&(y.style.display="flex")}hideEditProjectModal(){const e=document.getElementById("edit-project-modal");e&&(e.style.display="none")}handleEditProject(){const e=document.getElementById("edit-project-id"),t=document.getElementById("edit-project-title"),i=document.getElementById("edit-project-description"),a=document.getElementById("edit-project-status"),s=document.getElementById("edit-project-progress"),n=document.getElementById("edit-project-category"),r=document.getElementById("edit-project-priority"),l=document.getElementById("edit-project-open-date"),p=document.getElementById("edit-project-deadline"),g=document.getElementById("edit-project-notification"),w=document.getElementById("edit-project-start"),v=document.getElementById("edit-project-end"),h=document.getElementById("edit-project-url");if(!e||!t.value.trim()||!i.value.trim()){alert("Please fill in title and description");return}this.projectManager.updateProject(e.value,{title:t.value.trim(),description:i.value.trim(),status:a.value,progress:parseInt(s.value)||0,category:n.value,priority:r.value,applicationOpenDate:l.value?new Date(l.value):void 0,applicationDeadline:p.value?new Date(p.value):void 0,notificationDate:g.value?new Date(g.value):void 0,programStartDate:w.value?new Date(w.value):void 0,programEndDate:v.value?new Date(v.value):void 0,url:h.value.trim()||void 0}),this.hideEditProjectModal(),this.render()}showAddMilestoneForm(){if(!this.selectedProject)return;const e=prompt("Milestone title:");if(!e)return;const t=prompt("Date (YYYY-MM-DD):");if(!t)return;const i=new Date(t);if(isNaN(i.getTime())){alert("Invalid date");return}this.projectManager.addMilestone(this.selectedProject.id,e,i),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render()}showAddNoteForm(){if(!this.selectedProject)return;const e=prompt("Note content:");e&&(this.projectManager.addNote(this.selectedProject.id,e),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render())}showAddQuestionForm(){if(!this.selectedProject)return;const e=prompt("Application question:");e&&(this.projectManager.addQuestion(this.selectedProject.id,e),this.selectedProject=this.projectManager.getProject(this.selectedProject.id)||null,this.render())}}class x{static exportAllData(){const e=localStorage.getItem("categorized-todo-items"),t=localStorage.getItem("projects"),i=localStorage.getItem("identity-goals"),a=e?JSON.parse(e):[],s=t?JSON.parse(t):[],n=i?JSON.parse(i):[];return{version:this.VERSION,exportDate:new Date().toISOString(),items:a,projects:s,identityGoals:n,metadata:{totalItems:a.length,totalProjects:s.length,totalGoals:n.length}}}static downloadAsJSON(e,t){const i=JSON.stringify(e,null,2),a=new Blob([i],{type:"application/json"}),s=URL.createObjectURL(a),n=document.createElement("a");n.href=s,n.download=t||`productivity-app-backup-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s)}static importData(e){try{if(!e.version||!e.items||!e.projects||!e.identityGoals)return{success:!1,message:"Invalid backup file format"};const t=this.exportAllData();return sessionStorage.setItem("pre-import-backup",JSON.stringify(t)),localStorage.setItem("categorized-todo-items",JSON.stringify(e.items)),localStorage.setItem("projects",JSON.stringify(e.projects)),localStorage.setItem("identity-goals",JSON.stringify(e.identityGoals)),{success:!0,message:`Successfully imported ${e.metadata.totalItems} tasks, ${e.metadata.totalProjects} projects, and ${e.metadata.totalGoals} goals`}}catch(t){return console.error("Import failed:",t),{success:!1,message:"Failed to import data. Please check the file format."}}}static restorePreImportBackup(){try{const e=sessionStorage.getItem("pre-import-backup");if(!e)return!1;const t=JSON.parse(e);return localStorage.setItem("categorized-todo-items",JSON.stringify(t.items)),localStorage.setItem("projects",JSON.stringify(t.projects)),localStorage.setItem("identity-goals",JSON.stringify(t.identityGoals)),sessionStorage.removeItem("pre-import-backup"),!0}catch(e){return console.error("Restore failed:",e),!1}}static clearAllData(){confirm("⚠️ This will delete ALL your data. Are you sure? This cannot be undone!")&&confirm("Really delete everything? Last chance to cancel!")&&(localStorage.removeItem("categorized-todo-items"),localStorage.removeItem("projects"),localStorage.removeItem("identity-goals"),window.location.reload())}}o(x,"VERSION","1.0.0");class ae{constructor(e){o(this,"container");o(this,"onDataChange");this.container=document.getElementById("settings-container"),this.onDataChange=e.onDataChange}render(){this.container.innerHTML=`
      <div class="settings-view">
        <div class="settings-header">
          <h2>⚙️ Settings & Data Management</h2>
          <p>Manage your data, backups, and app preferences</p>
        </div>

        <div class="settings-sections">
          <!-- Data Backup Section -->
          <div class="settings-section">
            <div class="section-icon">💾</div>
            <div class="section-content">
              <h3>Data Backup & Export</h3>
              <p>Download all your tasks, projects, and goals as a JSON file</p>
              <div class="settings-actions">
                <button class="btn-primary" id="export-data-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export All Data
                </button>
              </div>
            </div>
          </div>

          <!-- Data Import Section -->
          <div class="settings-section">
            <div class="section-icon">📥</div>
            <div class="section-content">
              <h3>Import Data</h3>
              <p>Restore from a previous backup file</p>
              <div class="settings-actions">
                <input type="file" id="import-file-input" accept=".json" style="display: none;">
                <button class="btn-secondary" id="import-data-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Import from File
                </button>
              </div>
              <p class="help-text">⚠️ This will replace your current data. Export first to create a backup!</p>
            </div>
          </div>

          <!-- Storage Info Section -->
          <div class="settings-section">
            <div class="section-icon">📊</div>
            <div class="section-content">
              <h3>Storage Information</h3>
              <div id="storage-info" class="storage-info">
                <div class="info-item">
                  <span class="info-label">Tasks & Habits:</span>
                  <span class="info-value" id="items-count">0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Projects:</span>
                  <span class="info-value" id="projects-count">0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Identity Goals:</span>
                  <span class="info-value" id="goals-count">0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Storage Used:</span>
                  <span class="info-value" id="storage-size">0 KB</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="settings-section danger-section">
            <div class="section-icon">⚠️</div>
            <div class="section-content">
              <h3>Danger Zone</h3>
              <p>Permanently delete all data from this device</p>
              <div class="settings-actions">
                <button class="btn-danger" id="clear-all-data-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Clear All Data
                </button>
              </div>
              <p class="help-text">⚠️ This action cannot be undone! Export your data first.</p>
            </div>
          </div>

          <!-- About Section -->
          <div class="settings-section">
            <div class="section-icon">ℹ️</div>
            <div class="section-content">
              <h3>About</h3>
              <div class="about-info">
                <p><strong>Productivity App</strong></p>
                <p>Version 1.0.0</p>
                <p>A comprehensive task management and habit tracking application</p>
                <p class="help-text">Built with TypeScript, Vite, and Chart.js</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,this.updateStorageInfo(),this.attachEventListeners()}updateStorageInfo(){const e=x.exportAllData(),t=document.getElementById("items-count"),i=document.getElementById("projects-count"),a=document.getElementById("goals-count"),s=document.getElementById("storage-size");t&&(t.textContent=e.metadata.totalItems.toString()),i&&(i.textContent=e.metadata.totalProjects.toString()),a&&(a.textContent=e.metadata.totalGoals.toString());const n=JSON.stringify(e),r=(new Blob([n]).size/1024).toFixed(2);s&&(s.textContent=`${r} KB`)}attachEventListeners(){const e=document.getElementById("export-data-btn");e==null||e.addEventListener("click",()=>this.handleExport());const t=document.getElementById("import-data-btn"),i=document.getElementById("import-file-input");t==null||t.addEventListener("click",()=>i==null?void 0:i.click()),i==null||i.addEventListener("change",s=>this.handleImport(s));const a=document.getElementById("clear-all-data-btn");a==null||a.addEventListener("click",()=>this.handleClearAll())}handleExport(){try{const e=x.exportAllData();x.downloadAsJSON(e),this.showToast("✅ Data exported successfully!","success")}catch(e){console.error("Export failed:",e),this.showToast("❌ Failed to export data","error")}}async handleImport(e){var a;const t=e.target,i=(a=t.files)==null?void 0:a[0];if(i){try{const s=await i.text(),n=JSON.parse(s),r=x.importData(n);r.success?(this.showToast(`✅ ${r.message}`,"success"),setTimeout(()=>{this.onDataChange(),this.updateStorageInfo()},1e3)):this.showToast(`❌ ${r.message}`,"error")}catch(s){console.error("Import failed:",s),this.showToast("❌ Invalid backup file","error")}t.value=""}}handleClearAll(){x.clearAllData()}showToast(e,t){const i=document.createElement("div");i.className=`toast ${t}`,i.textContent=e;const a=document.getElementById("toast-container");a&&(a.appendChild(i),setTimeout(()=>i.remove(),3e3))}}class se{constructor(e){o(this,"container");o(this,"getItems");o(this,"onComplete");o(this,"onEdit");o(this,"onSetPriority");this.container=document.getElementById("daily-focus-container"),this.getItems=e.getItems,this.onComplete=e.onComplete,this.onEdit=e.onEdit,this.onSetPriority=e.onSetPriority}async refresh(){const e=await this.getItems(),t=new Date;t.setHours(0,0,0,0);const i=e.filter(n=>{if(n.type==="note"||n.completed)return!1;if(n.priority==="daily-focus")return!0;if(n.dueDate){const l=new Date(n.dueDate);return l.setHours(0,0,0,0),l.getTime()===t.getTime()}const r=new Date(n.createdAt);return r.setHours(0,0,0,0),r.getTime()===t.getTime()}),a=i.filter(n=>n.priority==="daily-focus").slice(0,3),s=i.filter(n=>n.priority!=="daily-focus");this.render(a,s)}render(e,t){const i=3-e.length;this.container.innerHTML=`
      <div class="daily-focus-header">
        <div class="focus-title">
          <h3>🎯 Today's Focus</h3>
          <p>Your 3 most important wins for today</p>
        </div>
        <div class="focus-progress">
          <span class="focus-count">${e.filter(a=>a.completed).length}/3</span>
          <span class="focus-label">completed</span>
        </div>
      </div>
      
      <div class="daily-focus-slots">
        ${this.renderFocusSlots(e,i)}
      </div>
      
      ${i>0&&t.length>0?`
        <div class="focus-suggestions">
          <h4>📋 Add to Focus</h4>
          <div class="suggestion-list">
            ${t.slice(0,5).map(a=>this.renderSuggestion(a)).join("")}
          </div>
        </div>
      `:""}
      
      ${e.length===0?`
        <div class="focus-empty-state">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" fill="#e3f2fd"/>
            <path d="M40 25v30M25 40h30" stroke="#4169E1" stroke-width="4" stroke-linecap="round"/>
          </svg>
          <p>Set your 3 most important tasks for today</p>
          <small>Focus on what matters most</small>
        </div>
      `:""}
    `,this.attachEventListeners()}renderFocusSlots(e,t){let i="";e.forEach((a,s)=>{i+=this.renderFocusTask(a,s+1)});for(let a=0;a<t;a++)i+=`
        <div class="focus-slot empty">
          <div class="slot-number">${e.length+a+1}</div>
          <div class="slot-placeholder">
            <span>Add a priority task</span>
          </div>
        </div>
      `;return i}renderFocusTask(e,t){const i=S[e.category];return`
      <div class="focus-slot filled ${e.completed?"completed":""}" data-task-id="${e.id}">
        <div class="slot-number">${t}</div>
        <div class="focus-task-content">
          <div class="focus-task-header">
            <input 
              type="checkbox" 
              class="focus-checkbox" 
              ${e.completed?"checked":""}
              data-task-id="${e.id}"
            />
            <div class="focus-task-desc" data-task-id="${e.id}">${e.description}</div>
          </div>
          <div class="focus-task-meta">
            <span class="focus-category" style="background-color: ${i.color}20; color: ${i.color};">
              ${i.name}
            </span>
            ${e.effortLevel==="quick"?'<span class="effort-badge quick">⚡ 2-min</span>':""}
            ${e.isHabit?'<span class="habit-badge">🔄 Habit</span>':""}
          </div>
        </div>
        <button class="remove-focus-btn" data-task-id="${e.id}" title="Remove from focus">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `}renderSuggestion(e){const t=S[e.category];return`
      <div class="suggestion-item" data-task-id="${e.id}">
        <div class="suggestion-content">
          <div class="suggestion-desc">${e.description}</div>
          <span class="suggestion-category" style="background-color: ${t.color}20; color: ${t.color};">
            ${t.name}
          </span>
        </div>
        <button class="add-to-focus-btn" data-task-id="${e.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(".focus-checkbox").forEach(s=>{s.addEventListener("change",n=>{const l=n.target.getAttribute("data-task-id");l&&this.onComplete(l)})}),this.container.querySelectorAll(".focus-task-desc").forEach(s=>{s.addEventListener("click",async n=>{const r=n.target.getAttribute("data-task-id");if(r){const p=(await this.getItems()).find(g=>g.id===r);p&&this.onEdit(p)}})}),this.container.querySelectorAll(".remove-focus-btn").forEach(s=>{s.addEventListener("click",n=>{var l;const r=(l=n.target.closest("button"))==null?void 0:l.getAttribute("data-task-id");r&&this.onSetPriority(r,null)})}),this.container.querySelectorAll(".add-to-focus-btn").forEach(s=>{s.addEventListener("click",n=>{var l;const r=(l=n.target.closest("button"))==null?void 0:l.getAttribute("data-task-id");r&&this.onSetPriority(r,"daily-focus")})})}}class ne{constructor(e){o(this,"container");o(this,"getItems");o(this,"onComplete");o(this,"onEdit");this.container=document.getElementById("habit-tracker-container"),this.getItems=e.getItems,this.onComplete=e.onComplete,this.onEdit=e.onEdit}async refresh(){const t=(await this.getItems()).filter(s=>s.isHabit&&!s.completed),i=new Date;i.setHours(0,0,0,0);const a=t.map(s=>({...s,completedToday:this.wasCompletedToday(s,i)}));this.render(a)}wasCompletedToday(e,t){var a;if(!((a=e.habitStreak)!=null&&a.lastCompletedDate))return!1;const i=new Date(e.habitStreak.lastCompletedDate);return i.setHours(0,0,0,0),i.getTime()===t.getTime()}render(e){const t=e.reduce((a,s)=>{var n;return a+(((n=s.habitStreak)==null?void 0:n.currentStreak)||0)},0),i=e.filter(a=>a.completedToday).length;this.container.innerHTML=`
      <div class="habit-tracker-header">
        <div class="habit-title">
          <h3>🔥 Habit Tracker</h3>
          <p>Build consistency, one day at a time</p>
        </div>
        <div class="habit-stats">
          <div class="habit-stat">
            <span class="stat-value">${i}/${e.length}</span>
            <span class="stat-label">Today</span>
          </div>
          <div class="habit-stat">
            <span class="stat-value">${t}</span>
            <span class="stat-label">Total Streak</span>
          </div>
        </div>
      </div>

      <div class="habits-list">
        ${e.length>0?e.map(a=>this.renderHabit(a)).join(""):this.renderEmptyState()}
      </div>
    `,this.attachEventListeners()}renderHabit(e){var n,r,l;const t=S[e.category],i=((n=e.habitStreak)==null?void 0:n.currentStreak)||0,a=((r=e.habitStreak)==null?void 0:r.longestStreak)||0,s=((l=e.habitStreak)==null?void 0:l.totalCompletions)||0;return`
      <div class="habit-card ${e.completedToday?"completed-today":""}" data-habit-id="${e.id}">
        <div class="habit-check-container">
          <button class="habit-check-btn ${e.completedToday?"checked":""}" data-habit-id="${e.id}">
            ${e.completedToday?'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>':'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'}
          </button>
        </div>
        
        <div class="habit-content" data-habit-id="${e.id}">
          <div class="habit-name">${e.description}</div>
          <div class="habit-meta">
            <span class="habit-category" style="background-color: ${t.color}20; color: ${t.color};">
              ${t.name}
            </span>
            ${e.effortLevel==="quick"?'<span class="effort-badge quick">⚡ 2-min</span>':""}
          </div>
        </div>

        <div class="habit-streak-info">
          <div class="streak-display ${i>0?"active":""}">
            <span class="streak-icon">🔥</span>
            <span class="streak-number">${i}</span>
            <span class="streak-label">day${i!==1?"s":""}</span>
          </div>
          ${a>i?`<div class="streak-best">Best: ${a}</div>`:""}
          <div class="streak-total">${s} total</div>
        </div>
      </div>
    `}renderEmptyState(){return`
      <div class="habit-empty-state">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="30" fill="#fff5f5"/>
          <path d="M30 40 L35 45 L50 30" stroke="#DC143C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>No habits yet</p>
        <small>Create a task and mark it as a habit to start tracking</small>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(".habit-check-btn").forEach(i=>{i.addEventListener("click",a=>{a.stopPropagation();const s=a.currentTarget.getAttribute("data-habit-id");s&&this.onComplete(s)})}),this.container.querySelectorAll(".habit-content").forEach(i=>{i.addEventListener("click",async a=>{const s=a.currentTarget.getAttribute("data-habit-id");if(s){const r=(await this.getItems()).find(l=>l.id===s);r&&this.onEdit(r)}})})}}class oe{constructor(e){o(this,"container");o(this,"getItems");o(this,"onComplete");this.container=document.getElementById("quick-wins-container"),this.getItems=e.getItems,this.onComplete=e.onComplete}async refresh(){const t=(await this.getItems()).filter(i=>i.effortLevel==="quick"&&!i.completed&&i.type!=="note");this.render(t)}render(e){this.container.innerHTML=`
      <div class="quick-wins-header">
        <div class="quick-title">
          <h4>⚡ Quick Wins</h4>
          <p>2-minute tasks for instant momentum</p>
        </div>
        <div class="quick-count">${e.length} task${e.length!==1?"s":""}</div>
      </div>

      <div class="quick-wins-list">
        ${e.length>0?e.slice(0,5).map(t=>this.renderQuickTask(t)).join(""):this.renderEmptyState()}
      </div>
    `,this.attachEventListeners()}renderQuickTask(e){const t=S[e.category];return`
      <div class="quick-task" data-task-id="${e.id}">
        <button class="quick-check-btn" data-task-id="${e.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </button>
        <div class="quick-task-content">
          <div class="quick-task-desc">${e.description}</div>
          <span class="quick-task-category" style="background-color: ${t.color}20; color: ${t.color};">
            ${t.name}
          </span>
        </div>
        <div class="quick-task-time">~2min</div>
      </div>
    `}renderEmptyState(){return`
      <div class="quick-empty-state">
        <p>No quick tasks</p>
        <small>Tag tasks as "2-min" for easy wins</small>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(".quick-check-btn").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const a=i.currentTarget.getAttribute("data-task-id");a&&this.onComplete(a)})})}}class M{constructor(e){o(this,"container");o(this,"getItems");const t=e.containerId||"weekly-review-container";this.container=document.getElementById(t),this.getItems=e.getItems}async refresh(){const e=await this.getItems(),t=this.calculateWeekData(e);this.render(t)}calculateWeekData(e){const t=new Date,i=new Date(t.getTime()-10080*60*1e3),a=e.filter(h=>new Date(h.createdAt)>=i),s=a.filter(h=>h.completed),n=e.filter(h=>h.isHabit),r=n.map(h=>{var d,y;const m=((y=(d=h.habitStreak)==null?void 0:d.completionDates)==null?void 0:y.filter(I=>new Date(I)>=i).length)||0;return{habit:h,completedDays:m,rate:m/7*100}}),l=Object.keys(S).map(h=>{const m=s.filter(d=>d.category===h);return{category:h,count:m.length,config:S[h]}}).filter(h=>h.count>0).sort((h,m)=>m.count-h.count),p=s.reduce((h,m)=>h+(m.points||0),0),g=n.filter(h=>{var m;return(((m=h.habitStreak)==null?void 0:m.currentStreak)||0)>0}),w=Math.max(...n.map(h=>{var m;return((m=h.habitStreak)==null?void 0:m.currentStreak)||0}),0),v=n.filter(h=>{var m;return(m=h.habitStreak)==null?void 0:m.missedYesterday});return{totalCreated:a.length,totalCompleted:s.length,completionRate:a.length>0?Math.round(s.length/a.length*100):0,totalPoints:p,habitCompletions:r,categoryStats:l,activeStreaks:g.length,longestStreak:w,missedYesterday:v}}render(e){this.container.innerHTML=`
      <div class="weekly-review-card">
        <div class="weekly-review-header">
          <div class="review-header-content">
            <div class="review-icon">📊</div>
            <div class="review-title-group">
              <h3>Weekly Review</h3>
              <p>Your progress over the last 7 days</p>
            </div>
          </div>
          <div class="review-date-badge">
            ${this.getWeekRange()}
          </div>
        </div>

        <div class="review-stats-grid">
          <div class="review-stat-card primary">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">✅</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${e.totalCompleted}</div>
                <div class="stat-label">Tasks Completed</div>
              </div>
            </div>
          </div>
          
          <div class="review-stat-card success">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">🎯</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${e.completionRate}%</div>
                <div class="stat-label">Completion Rate</div>
                <div class="stat-progress">
                  <div class="stat-progress-bar" style="width: ${e.completionRate}%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="review-stat-card warning">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">⭐</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${e.totalPoints}</div>
                <div class="stat-label">Points Earned</div>
              </div>
            </div>
          </div>
          
          <div class="review-stat-card danger">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">🔥</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${e.longestStreak}</div>
                <div class="stat-label">Longest Streak</div>
              </div>
            </div>
          </div>
        </div>

        <div class="review-content-grid">
          ${e.habitCompletions.length>0?`
            <div class="review-section habits-section">
              <div class="section-header">
                <h4><span class="section-icon">🔄</span> Habit Performance</h4>
              </div>
              <div class="habit-performance-list">
                ${e.habitCompletions.map(t=>this.renderHabitPerformance(t)).join("")}
              </div>
            </div>
          `:""}

          ${e.categoryStats.length>0?`
            <div class="review-section category-section">
              <div class="section-header">
                <h4><span class="section-icon">📈</span> Category Breakdown</h4>
              </div>
              <div class="category-breakdown">
                ${e.categoryStats.map(t=>this.renderCategoryBar(t)).join("")}
              </div>
            </div>
          `:""}
        </div>

        ${e.missedYesterday.length>0?`
          <div class="review-alert warning-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <h4>Never Miss Twice</h4>
              <p>These habits were missed yesterday. Get back on track today!</p>
              <div class="missed-habits-list">
                ${e.missedYesterday.map(t=>`
                  <div class="missed-habit-item">
                    <span class="missed-icon">🔴</span>
                    <span class="missed-text">${t.description}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `:""}

        <div class="review-insights-card">
          <div class="insights-header">
            <span class="insights-icon">💡</span>
            <h4>Insights & Recommendations</h4>
          </div>
          <div class="insights-list">
            ${this.generateInsights(e).map(t=>`
              <div class="insight-item">
                <span class="insight-bullet">•</span>
                <span class="insight-text">${t}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}getWeekRange(){const e=new Date,t=new Date(e.getTime()-10080*60*1e3),i={month:"short",day:"numeric"};return`${t.toLocaleDateString("en-US",i)} - ${e.toLocaleDateString("en-US",i)}`}renderHabitPerformance(e){const t=Math.round(e.rate),i=S[e.habit.category];return`
      <div class="habit-performance-item">
        <div class="habit-perf-header">
          <div class="habit-perf-name">${e.habit.description}</div>
          <div class="habit-perf-badge">${e.completedDays}/7 days</div>
        </div>
        <div class="habit-perf-bar-container">
          <div class="habit-perf-bar">
            <div class="habit-perf-fill" style="width: ${t}%; background: linear-gradient(90deg, ${i.color}, ${this.lightenColor(i.color)});"></div>
          </div>
          <div class="habit-perf-percent">${t}%</div>
        </div>
      </div>
    `}renderCategoryBar(e){const i=Math.min(e.count/20*100,100);return`
      <div class="category-bar-item">
        <div class="category-bar-header">
          <div class="category-bar-label">
            <span class="category-dot" style="background-color: ${e.config.color};"></span>
            <span class="category-name">${e.config.name}</span>
          </div>
          <div class="category-bar-count">${e.count}</div>
        </div>
        <div class="category-bar-visual">
          <div class="category-bar-fill" style="width: ${i}%; background: linear-gradient(90deg, ${e.config.color}, ${this.lightenColor(e.config.color)});"></div>
        </div>
      </div>
    `}lightenColor(e){const t=e.replace("#",""),i=parseInt(t.substr(0,2),16),a=parseInt(t.substr(2,2),16),s=parseInt(t.substr(4,2),16),n=Math.min(255,i+40),r=Math.min(255,a+40),l=Math.min(255,s+40);return`#${n.toString(16).padStart(2,"0")}${r.toString(16).padStart(2,"0")}${l.toString(16).padStart(2,"0")}`}generateInsights(e){const t=[];e.completionRate>=80?t.push("🌟 Excellent completion rate! You're crushing it!"):e.completionRate>=60?t.push("👍 Good progress! Keep up the momentum."):e.completionRate<40&&t.push("💪 Focus on completing fewer, more important tasks."),e.activeStreaks>0&&t.push(`🔥 You have ${e.activeStreaks} active habit streak${e.activeStreaks>1?"s":""}!`),e.longestStreak>=7&&t.push(`🏆 Your longest streak is ${e.longestStreak} days. That's commitment!`);const i=e.categoryStats[0];return i&&t.push(`📊 Most productive in: ${i.config.name} (${i.count} tasks)`),e.totalPoints>100&&t.push(`⭐ You earned ${e.totalPoints} points this week!`),t.length===0&&t.push("Start building habits and completing tasks to see insights!"),t}}const T=[{name:"Morning Meditation",description:"Meditate for 10 minutes",category:u.SELF_CARE,effortLevel:"quick",implementationIntention:{time:"7:00 AM",location:"Bedroom",duration:10},icon:"🧘"},{name:"Daily Exercise",description:"Exercise for 30 minutes",category:u.EXERCISE,effortLevel:"medium",implementationIntention:{time:"6:00 AM",location:"Gym",duration:30},icon:"🏃"},{name:"Read Before Bed",description:"Read for 20 minutes",category:u.KNOWLEDGE_HUB,effortLevel:"quick",implementationIntention:{time:"9:00 PM",location:"Bedroom",duration:20},icon:"📚"},{name:"Drink Water",description:"Drink 8 glasses of water",category:u.SELF_CARE,effortLevel:"quick",icon:"💧"},{name:"Gratitude Journal",description:"Write 3 things I'm grateful for",category:u.SELF_CARE,effortLevel:"quick",implementationIntention:{time:"9:00 PM",location:"Desk",duration:5},icon:"📝"},{name:"Morning Walk",description:"Take a 15-minute walk",category:u.EXERCISE,effortLevel:"quick",implementationIntention:{time:"7:30 AM",location:"Neighborhood",duration:15},icon:"🚶"},{name:"Healthy Breakfast",description:"Eat a nutritious breakfast",category:u.SELF_CARE,effortLevel:"quick",implementationIntention:{time:"8:00 AM",location:"Kitchen",duration:15},icon:"🥗"},{name:"Deep Work Session",description:"Focus on important work for 90 minutes",category:u.WORK,effortLevel:"long",implementationIntention:{time:"9:00 AM",location:"Office",duration:90},icon:"💼"},{name:"Call a Friend",description:"Connect with a friend or family member",category:u.FRIENDS_SOCIAL,effortLevel:"quick",implementationIntention:{duration:10},icon:"📞"},{name:"Evening Stretch",description:"Stretch for 10 minutes",category:u.EXERCISE,effortLevel:"quick",implementationIntention:{time:"8:00 PM",location:"Living Room",duration:10},icon:"🤸"}];class re{constructor(e){o(this,"container");o(this,"onSelectTemplate");this.container=document.getElementById("habit-templates-container"),this.onSelectTemplate=e.onSelectTemplate}render(){this.container.innerHTML=`
      <div class="templates-header">
        <h4>🎯 Habit Templates</h4>
        <p>Quick-start popular habits</p>
      </div>
      <div class="templates-grid">
        ${T.map(e=>this.renderTemplate(e)).join("")}
      </div>
    `,this.attachEventListeners()}renderTemplate(e){var t;return`
      <div class="template-card" data-template="${e.name}">
        <div class="template-icon">${e.icon}</div>
        <div class="template-content">
          <div class="template-name">${e.name}</div>
          <div class="template-desc">${e.description}</div>
          ${(t=e.implementationIntention)!=null&&t.time?`
            <div class="template-time">⏰ ${e.implementationIntention.time}</div>
          `:""}
        </div>
        <button class="template-add-btn" data-template="${e.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(".template-add-btn").forEach(t=>{t.addEventListener("click",async i=>{i.stopPropagation();const a=i.currentTarget.getAttribute("data-template"),s=T.find(n=>n.name===a);s&&await this.handleTemplateSelect(s)})})}async handleTemplateSelect(e){const t={description:e.description,category:e.category,effortLevel:e.effortLevel,isHabit:!0,implementationIntention:e.implementationIntention,priority:"normal"};await this.onSelectTemplate(t)}}class P{constructor(e){o(this,"container");o(this,"getItems");const t=e.containerId||"habit-heatmap-container";this.container=document.getElementById(t),this.getItems=e.getItems}async refresh(){const t=(await this.getItems()).filter(i=>i.isHabit);if(t.length===0){this.renderEmpty();return}this.render(t)}render(e){var a,s,n;const t=e[0],i=this.generateHeatmapData(t);this.container.innerHTML=`
      <div class="heatmap-card">
        <div class="heatmap-header">
          <div class="heatmap-title">
            <span class="heatmap-icon">📊</span>
            <h3>Habit Heatmap</h3>
          </div>
          <select id="habit-selector" class="habit-selector">
            ${e.map(r=>`<option value="${r.id}">${r.description}</option>`).join("")}
          </select>
        </div>

        <div class="heatmap-content">
          <div class="heatmap-stats">
            <div class="heatmap-stat">
              <span class="stat-value">${((a=t.habitStreak)==null?void 0:a.currentStreak)||0}</span>
              <span class="stat-label">Current Streak</span>
            </div>
            <div class="heatmap-stat">
              <span class="stat-value">${((s=t.habitStreak)==null?void 0:s.longestStreak)||0}</span>
              <span class="stat-label">Longest Streak</span>
            </div>
            <div class="heatmap-stat">
              <span class="stat-value">${((n=t.habitStreak)==null?void 0:n.totalCompletions)||0}</span>
              <span class="stat-label">Total Days</span>
            </div>
          </div>

          <div class="heatmap-grid-container">
            <div class="heatmap-months">
              ${this.renderMonthLabels(i)}
            </div>
            <div class="heatmap-grid-wrapper">
              <div class="heatmap-weekdays">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div class="heatmap-grid">
                ${this.renderHeatmapCells(i)}
              </div>
            </div>
          </div>

          <div class="heatmap-legend">
            <span class="legend-label">Less</span>
            <div class="legend-cell level-0"></div>
            <div class="legend-cell level-1"></div>
            <div class="legend-cell level-2"></div>
            <div class="legend-cell level-3"></div>
            <div class="legend-cell level-4"></div>
            <span class="legend-label">More</span>
          </div>
        </div>
      </div>
    `,this.attachEventListeners(e)}generateHeatmapData(e){var a;const t=new Map;return(((a=e.habitStreak)==null?void 0:a.completionDates)||[]).forEach(s=>{const n=new Date(s),r=this.getDateKey(n);t.set(r,!0)}),t}renderMonthLabels(e){const t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],i=new Date,a=new Date(i);a.setDate(a.getDate()-364);const s=[];let n=a.getMonth();for(let r=0;r<12;r++)s.push(t[n]),n=(n+1)%12;return s.map(r=>`<span class="month-label">${r}</span>`).join("")}renderHeatmapCells(e){const t=new Date,i=new Date(t);i.setDate(i.getDate()-364);let a="",s=new Date(i);const n=s.getDay(),r=n===0?6:n-1;s.setDate(s.getDate()-r);for(let l=0;l<53;l++){a+='<div class="heatmap-week">';for(let p=0;p<7;p++){const g=this.getDateKey(s),w=e.has(g),v=s>t,m=["heatmap-cell",`level-${w?4:0}`];v&&m.push("future"),a+=`
          <div class="${m.join(" ")}" 
               data-date="${g}"
               title="${this.formatDate(s)}: ${w?"Completed":"Not completed"}">
          </div>
        `,s.setDate(s.getDate()+1)}a+="</div>"}return a}getDateKey(e){return e.toISOString().split("T")[0]}formatDate(e){return e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}renderEmpty(){this.container.innerHTML=`
      <div class="heatmap-empty">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="20" width="8" height="8" rx="2" fill="#e0e0e0"/>
          <rect x="20" y="20" width="8" height="8" rx="2" fill="#e0e0e0"/>
          <rect x="30" y="20" width="8" height="8" rx="2" fill="#32CD32"/>
          <rect x="40" y="20" width="8" height="8" rx="2" fill="#32CD32"/>
          <rect x="50" y="20" width="8" height="8" rx="2" fill="#e0e0e0"/>
        </svg>
        <p>Create habits to see your heatmap</p>
      </div>
    `}attachEventListeners(e){const t=document.getElementById("habit-selector");t&&t.addEventListener("change",async()=>{const i=t.value,a=e.find(s=>s.id===i);a&&this.render([a,...e.filter(s=>s.id!==i)])})}}class F{constructor(e){o(this,"container");o(this,"getItems");o(this,"goals",[]);const t=e.containerId||"identity-goals-container";this.container=document.getElementById(t),this.getItems=e.getItems,this.loadGoals()}loadGoals(){const e=localStorage.getItem("identity-goals");e&&(this.goals=JSON.parse(e))}saveGoals(){localStorage.setItem("identity-goals",JSON.stringify(this.goals))}async refresh(){const e=await this.getItems();this.render(e)}render(e){const t=e.filter(i=>i.isHabit);this.container.innerHTML=`
      <div class="identity-goals-card">
        <div class="identity-header">
          <div class="identity-title">
            <span class="identity-icon">🎯</span>
            <h3>Identity & Goals</h3>
          </div>
          <button class="add-identity-btn" id="add-identity-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Identity
          </button>
        </div>

        <div class="identity-description">
          <p>Define who you want to become. Your habits should align with your identity.</p>
        </div>

        ${this.goals.length>0?`
          <div class="identity-goals-list">
            ${this.goals.map(i=>this.renderGoal(i,t)).join("")}
          </div>
        `:`
          <div class="identity-empty">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" fill="#e3f2fd"/>
              <path d="M50 30v40M30 50h40" stroke="#4169E1" stroke-width="4" stroke-linecap="round"/>
            </svg>
            <h4>Define Your Identity</h4>
            <p>Start by defining who you want to become</p>
            <div class="identity-examples">
              <span class="example-badge">I am a healthy person</span>
              <span class="example-badge">I am a reader</span>
              <span class="example-badge">I am organized</span>
            </div>
          </div>
        `}

        <div class="identity-form" id="identity-form" style="display: none;">
          <h4>Add New Identity</h4>
          <div class="form-group">
            <label>I am a...</label>
            <input type="text" id="identity-input" placeholder="e.g., healthy person, reader, early riser" />
          </div>
          <div class="form-group">
            <label>What does this person do?</label>
            <textarea id="identity-description" placeholder="Describe the habits and behaviors of this identity..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Link Habits (optional)</label>
            <div class="habit-checkboxes">
              ${t.map(i=>`
                <label class="habit-checkbox-label">
                  <input type="checkbox" value="${i.id}" class="habit-link-checkbox" />
                  <span>${i.description}</span>
                </label>
              `).join("")}
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-secondary" id="cancel-identity-btn">Cancel</button>
            <button class="btn-primary" id="save-identity-btn">Save Identity</button>
          </div>
        </div>
      </div>
    `,this.attachEventListeners()}renderGoal(e,t){const i=t.filter(n=>e.linkedHabits.includes(n.id)),a=i.filter(n=>{var p;const r=new Date;r.setHours(0,0,0,0);const l=(p=n.habitStreak)!=null&&p.lastCompletedDate?new Date(n.habitStreak.lastCompletedDate):null;return l?(l.setHours(0,0,0,0),l.getTime()===r.getTime()):!1}).length,s=i.length>0?Math.round(a/i.length*100):0;return`
      <div class="identity-goal-card">
        <div class="identity-goal-header">
          <div class="identity-badge">I am a ${e.identity}</div>
          <button class="delete-identity-btn" data-id="${e.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="identity-goal-description">${e.description}</p>
        
        ${i.length>0?`
          <div class="identity-alignment">
            <div class="alignment-header">
              <span class="alignment-label">Identity Alignment</span>
              <span class="alignment-score">${s}%</span>
            </div>
            <div class="alignment-bar">
              <div class="alignment-fill" style="width: ${s}%; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
            </div>
            <div class="linked-habits">
              ${i.map(n=>{const r=a>0&&e.linkedHabits.includes(n.id);return`
                  <span class="linked-habit ${r?"completed":""}">
                    ${r?"✓":"○"} ${n.description}
                  </span>
                `}).join("")}
            </div>
          </div>
        `:""}
      </div>
    `}attachEventListeners(){const e=document.getElementById("add-identity-btn"),t=document.getElementById("cancel-identity-btn"),i=document.getElementById("save-identity-btn"),a=document.getElementById("identity-form");e==null||e.addEventListener("click",()=>{a&&(a.style.display="block")}),t==null||t.addEventListener("click",()=>{a&&(a.style.display="none"),this.clearForm()}),i==null||i.addEventListener("click",()=>{this.handleSaveIdentity()}),this.container.querySelectorAll(".delete-identity-btn").forEach(n=>{n.addEventListener("click",r=>{const l=r.currentTarget.getAttribute("data-id");l&&this.handleDeleteIdentity(l)})})}handleSaveIdentity(){const e=document.getElementById("identity-input"),t=document.getElementById("identity-description"),i=this.container.querySelectorAll(".habit-link-checkbox:checked"),a=e.value.trim(),s=t.value.trim();if(!a||!s)return;const n=Array.from(i).map(l=>l.value),r={id:Date.now().toString(),identity:a,description:s,linkedHabits:n,createdAt:new Date};this.goals.push(r),this.saveGoals(),this.clearForm(),this.refresh()}handleDeleteIdentity(e){this.goals=this.goals.filter(t=>t.id!==e),this.saveGoals(),this.refresh()}clearForm(){const e=document.getElementById("identity-input"),t=document.getElementById("identity-description"),i=this.container.querySelectorAll(".habit-link-checkbox");e&&(e.value=""),t&&(t.value=""),i.forEach(s=>s.checked=!1);const a=document.getElementById("identity-form");a&&(a.style.display="none")}}class H{constructor(e){o(this,"container");o(this,"getItems");const t=e.containerId||"progress-analytics-container";this.container=document.getElementById(t),this.getItems=e.getItems}async refresh(){const e=await this.getItems(),t=this.calculateAnalytics(e);this.render(t)}calculateAnalytics(e){const t=new Date,i=new Date(t.getTime()-720*60*60*1e3),a=e.filter(d=>new Date(d.createdAt)>=i),s=a.filter(d=>d.completed),n=[];for(let d=0;d<4;d++){const y=new Date(t.getTime()-(d+1)*7*24*60*60*1e3),I=new Date(t.getTime()-d*7*24*60*60*1e3),D=e.filter(k=>{const b=new Date(k.createdAt);return b>=y&&b<I}),C=D.filter(k=>k.completed).length,f=D.length;n.unshift({week:`Week ${4-d}`,completed:C,total:f,rate:f>0?Math.round(C/f*100):0})}const l=e.filter(d=>d.isHabit).map(d=>{var D,C;const y=((D=d.habitStreak)==null?void 0:D.currentStreak)||0,I=((C=d.habitStreak)==null?void 0:C.totalCompletions)||0;return{habit:d,streak:y,total:I}}).sort((d,y)=>y.streak-d.streak),p=new Map;s.forEach(d=>{if(d.completedAt){const y=new Date(d.completedAt).toLocaleDateString("en-US",{weekday:"long"});p.set(y,(p.get(y)||0)+1)}});let g="N/A",w=0;p.forEach((d,y)=>{d>w&&(w=d,g=y)});const v=e.reduce((d,y)=>d+(y.points||0),0),h=e.filter(d=>{const y=new Date(d.createdAt),I=new Date(t.getTime()-10080*60*1e3);return y>=I}),m=Math.min(h.filter(d=>d.completed).length*10,100);return{last30Days:a.length,completed30Days:s.length,completionRate30Days:a.length>0?Math.round(s.length/a.length*100):0,weeklyData:n,habitConsistency:l.slice(0,5),bestDay:g,totalPoints:v,momentum:m}}render(e){this.container.innerHTML=`
      <div class="analytics-card">
        <div class="analytics-header">
          <div class="analytics-title">
            <span class="analytics-icon">📈</span>
            <h3>Progress Analytics</h3>
          </div>
          <div class="analytics-period">Last 30 Days</div>
        </div>

        <div class="analytics-overview">
          <div class="analytics-metric">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">${e.completionRate30Days}%</div>
              <div class="metric-label">Completion Rate</div>
            </div>
          </div>
          <div class="analytics-metric">
            <div class="metric-icon">🎯</div>
            <div class="metric-content">
              <div class="metric-value">${e.completed30Days}</div>
              <div class="metric-label">Tasks Completed</div>
            </div>
          </div>
          <div class="analytics-metric">
            <div class="metric-icon">⚡</div>
            <div class="metric-content">
              <div class="metric-value">${e.momentum}%</div>
              <div class="metric-label">Momentum Score</div>
            </div>
          </div>
          <div class="analytics-metric">
            <div class="metric-icon">📅</div>
            <div class="metric-content">
              <div class="metric-value">${e.bestDay}</div>
              <div class="metric-label">Best Day</div>
            </div>
          </div>
        </div>

        <div class="analytics-sections">
          <div class="analytics-section">
            <h4>📊 Weekly Trend</h4>
            <div class="weekly-trend-chart">
              ${e.weeklyData.map(t=>this.renderWeekBar(t)).join("")}
            </div>
          </div>

          ${e.habitConsistency.length>0?`
            <div class="analytics-section">
              <h4>🏆 Top Performing Habits</h4>
              <div class="top-habits-list">
                ${e.habitConsistency.map((t,i)=>this.renderTopHabit(t,i)).join("")}
              </div>
            </div>
          `:""}
        </div>

        <div class="analytics-insights">
          <h4>💡 Key Insights</h4>
          <div class="insights-grid">
            ${this.generateAnalyticsInsights(e).map(t=>`
              <div class="analytics-insight-card">
                <div class="insight-icon">${t.icon}</div>
                <div class="insight-text">${t.text}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}renderWeekBar(e){return`
      <div class="week-bar-container">
        <div class="week-bar-wrapper">
          <div class="week-bar" style="height: ${e.total>0?Math.min(e.completed/e.total*100,100):5}%;">
            <span class="week-bar-value">${e.completed}</span>
          </div>
        </div>
        <div class="week-label">${e.week}</div>
        <div class="week-rate">${e.rate}%</div>
      </div>
    `}renderTopHabit(e,t){return`
      <div class="top-habit-item">
        <span class="habit-rank">${["🥇","🥈","🥉","4️⃣","5️⃣"][t]}</span>
        <div class="habit-info">
          <div class="habit-name">${e.habit.description}</div>
          <div class="habit-stats">
            <span class="habit-streak">🔥 ${e.streak} day streak</span>
            <span class="habit-total">✓ ${e.total} completions</span>
          </div>
        </div>
      </div>
    `}generateAnalyticsInsights(e){const t=[];return e.momentum>=70?t.push({icon:"🚀",text:"You're on fire! Your momentum is strong this week."}):e.momentum<30&&t.push({icon:"💪",text:"Time to rebuild momentum. Start with one small task today."}),e.completionRate30Days>=80&&t.push({icon:"⭐",text:"Excellent completion rate! You're consistently following through."}),e.habitConsistency.length>0&&e.habitConsistency[0].streak>=7&&t.push({icon:"🏆",text:`Your longest streak is ${e.habitConsistency[0].streak} days. Keep it going!`}),e.bestDay!=="N/A"&&t.push({icon:"📅",text:`${e.bestDay} is your most productive day.`}),t.length===0&&t.push({icon:"🌱",text:"Keep building your habits. Consistency is key!"}),t}}class ce{constructor(e){o(this,"modal");o(this,"form");o(this,"itemIdInput");o(this,"descriptionInput");o(this,"categorySelect");o(this,"dueDateInput");o(this,"locationInput");o(this,"tagsInput");o(this,"effortLevelSelect");o(this,"prioritySelect");o(this,"isHabitCheckbox");o(this,"intentionTimeInput");o(this,"intentionLocationInput");o(this,"intentionDurationInput");o(this,"stackAfterSelect");o(this,"cancelBtn");o(this,"options");this.options=e,this.modal=document.getElementById("edit-modal"),this.form=document.getElementById("edit-form"),this.itemIdInput=document.getElementById("edit-item-id"),this.descriptionInput=document.getElementById("edit-description"),this.categorySelect=document.getElementById("edit-category"),this.dueDateInput=document.getElementById("edit-due-date"),this.locationInput=document.getElementById("edit-location"),this.tagsInput=document.getElementById("edit-tags"),this.effortLevelSelect=document.getElementById("edit-effort-level"),this.prioritySelect=document.getElementById("edit-priority"),this.isHabitCheckbox=document.getElementById("edit-is-habit"),this.intentionTimeInput=document.getElementById("edit-intention-time"),this.intentionLocationInput=document.getElementById("edit-intention-location"),this.intentionDurationInput=document.getElementById("edit-intention-duration"),this.stackAfterSelect=document.getElementById("edit-stack-after"),this.cancelBtn=document.getElementById("cancel-edit"),this.initialize()}initialize(){for(const[e,t]of Object.entries(S)){const i=document.createElement("option");i.value=e,i.textContent=t.name,this.categorySelect.appendChild(i)}this.form.addEventListener("submit",this.handleSubmit.bind(this)),this.cancelBtn.addEventListener("click",this.close.bind(this)),this.modal.addEventListener("click",e=>{e.target===this.modal&&this.close()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.modal.classList.contains("active")&&this.close()})}open(e){var t,i,a,s,n,r;this.itemIdInput.value=e.id,this.descriptionInput.value=e.description,this.categorySelect.value=e.category,this.dueDateInput.value=e.dueDate?new Date(e.dueDate).toISOString().split("T")[0]:"",this.locationInput.value=e.location||"",this.tagsInput.value=((t=e.tags)==null?void 0:t.join(", "))||"",this.effortLevelSelect.value=e.effortLevel||"",this.prioritySelect.value=e.priority||"normal",this.isHabitCheckbox.checked=e.isHabit||!1,this.intentionTimeInput.value=((i=e.implementationIntention)==null?void 0:i.time)||"",this.intentionLocationInput.value=((a=e.implementationIntention)==null?void 0:a.location)||"",this.intentionDurationInput.value=((n=(s=e.implementationIntention)==null?void 0:s.duration)==null?void 0:n.toString())||"",this.stackAfterSelect.value=((r=e.habitStack)==null?void 0:r.afterHabitId)||"",this.modal.classList.add("active"),this.modal.setAttribute("aria-hidden","false"),this.descriptionInput.focus()}close(){this.modal.classList.remove("active"),this.modal.setAttribute("aria-hidden","true"),this.form.reset()}async handleSubmit(e){e.preventDefault();const t=this.itemIdInput.value,i=this.intentionTimeInput.value||this.intentionLocationInput.value||this.intentionDurationInput.value?{time:this.intentionTimeInput.value||void 0,location:this.intentionLocationInput.value.trim()||void 0,duration:this.intentionDurationInput.value?parseInt(this.intentionDurationInput.value):void 0}:void 0,a=this.stackAfterSelect.value?{afterHabitId:this.stackAfterSelect.value}:void 0,s={description:this.descriptionInput.value.trim(),category:this.categorySelect.value,dueDate:this.dueDateInput.value?new Date(this.dueDateInput.value):null,location:this.locationInput.value.trim()||null,tags:this.tagsInput.value?this.tagsInput.value.split(",").map(n=>n.trim()).filter(n=>n):[],effortLevel:this.effortLevelSelect.value||void 0,priority:this.prioritySelect.value||"normal",isHabit:this.isHabitCheckbox.checked,implementationIntention:i,habitStack:a};try{await this.options.onSave(t,s),this.close()}catch(n){console.error("Failed to save item:",n)}}}class le{constructor(){o(this,"container");this.container=document.getElementById("toast-container")}show(e,t="info",i=3e3){const a=document.createElement("div");a.className=`toast ${t}`,a.textContent=e,this.container.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(100%)",setTimeout(()=>a.remove(),300)},i)}success(e){this.show(e,"success")}error(e){this.show(e,"error")}info(e){this.show(e,"info")}}const O=["#FFD700","#FFA500","#4169E1","#32CD32","#9370DB","#DC143C","#FF69B4","#20B2AA"];class de{constructor(){o(this,"canvas");o(this,"ctx");o(this,"particles",[]);o(this,"animationId",null);this.canvas=document.getElementById("confetti-canvas"),this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>this.resize())}resize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}fire(){for(let e=0;e<150;e++)this.particles.push({x:window.innerWidth/2,y:window.innerHeight/2,vx:(Math.random()-.5)*20,vy:(Math.random()-.5)*20-10,color:O[Math.floor(Math.random()*O.length)],size:Math.random()*10+5,rotation:Math.random()*360,rotationSpeed:(Math.random()-.5)*10});this.animationId||this.animate()}animate(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.particles=this.particles.filter(e=>(e.x+=e.vx,e.y+=e.vy,e.vy+=.5,e.rotation+=e.rotationSpeed,e.vx*=.99,this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.rotation*Math.PI/180),this.ctx.fillStyle=e.color,this.ctx.fillRect(-e.size/2,-e.size/2,e.size,e.size/2),this.ctx.restore(),e.y<this.canvas.height+50)),this.particles.length>0?this.animationId=requestAnimationFrame(()=>this.animate()):this.animationId=null}}function pe(c){c.getAllProjects().length>0||(c.createProject({title:"Churchill Fellowship",description:"Application for Churchill Fellowship to research and travel internationally. Requires detailed project proposal and community impact statement.",category:"fellowship",applicationOpenDate:new Date("2025-02-01"),applicationDeadline:new Date("2025-03-31"),notificationDate:new Date("2025-06-15"),programStartDate:new Date("2025-09-01"),programEndDate:new Date("2026-03-01"),priority:"high"}),c.createProject({title:"Atlantic Council Millennium Fellowship",description:"Leadership program focused on global challenges and social innovation. Campus-based fellowship with international network.",category:"fellowship",applicationOpenDate:new Date("2025-01-15"),applicationDeadline:new Date("2025-02-28"),notificationDate:new Date("2025-04-01"),programStartDate:new Date("2025-08-01"),programEndDate:new Date("2025-12-15"),priority:"high"}),c.createProject({title:"SXSW Sydney (Speaker)",description:"Submit speaking proposal for SXSW Sydney on innovation, technology, or social impact topics.",category:"speaking",applicationOpenDate:new Date("2025-03-01"),applicationDeadline:new Date("2025-05-15"),notificationDate:new Date("2025-07-01"),programStartDate:new Date("2025-10-15"),programEndDate:new Date("2025-10-19"),priority:"medium"}),c.createProject({title:"Obama Foundation Leaders",description:"Leadership development program for emerging leaders working on community change. Focus on civic engagement and social impact.",category:"leadership",applicationOpenDate:new Date("2025-02-15"),applicationDeadline:new Date("2025-04-30"),notificationDate:new Date("2025-06-30"),programStartDate:new Date("2025-09-15"),programEndDate:new Date("2026-03-15"),priority:"high"}),c.createProject({title:"Westpac Social Change Fellowship",description:"Fellowship supporting social entrepreneurs and changemakers in Australia. Includes funding and mentorship.",category:"fellowship",applicationOpenDate:new Date("2025-04-01"),applicationDeadline:new Date("2025-06-15"),notificationDate:new Date("2025-08-15"),programStartDate:new Date("2025-10-01"),programEndDate:new Date("2026-10-01"),priority:"high"}),c.createProject({title:"Fulbright Professional Scholarship (Alliance Studies)",description:"Fulbright scholarship for professional development and research in alliance studies. US-Australia exchange program.",category:"scholarship",applicationOpenDate:new Date("2025-02-01"),applicationDeadline:new Date("2025-05-31"),notificationDate:new Date("2025-09-01"),programStartDate:new Date("2026-01-15"),programEndDate:new Date("2026-12-15"),priority:"high"}),c.createProject({title:"International Strategy Forum (ISF)",description:"Strategic leadership program focused on international relations and policy. Intensive seminar and networking.",category:"leadership",applicationOpenDate:new Date("2025-03-15"),applicationDeadline:new Date("2025-05-15"),notificationDate:new Date("2025-06-30"),programStartDate:new Date("2025-09-01"),programEndDate:new Date("2025-09-10"),priority:"medium"}),c.createProject({title:"Asia 21 Young Leaders (Asia Society)",description:"Premier leadership initiative for young leaders across Asia-Pacific. Focus on regional challenges and collaboration.",category:"leadership",applicationOpenDate:new Date("2025-01-01"),applicationDeadline:new Date("2025-03-15"),notificationDate:new Date("2025-05-01"),programStartDate:new Date("2025-08-15"),programEndDate:new Date("2025-08-20"),priority:"high"}),console.log("✅ Seeded 8 projects successfully"))}class he{constructor(){o(this,"storageManager");o(this,"categorizationEngine");o(this,"itemManager");o(this,"projectManager");o(this,"taskListComponent");o(this,"calendarComponent");o(this,"projectsComponent");o(this,"settingsComponent");o(this,"dailyFocusComponent");o(this,"habitTrackerComponent");o(this,"quickWinsComponent");o(this,"weeklyReviewComponent");o(this,"habitTemplatesComponent");o(this,"habitHeatmapComponent");o(this,"identityGoalsComponent");o(this,"progressAnalyticsComponent");o(this,"hubWeeklyReviewComponent");o(this,"hubProgressAnalyticsComponent");o(this,"hubHabitHeatmapComponent");o(this,"hubIdentityGoalsComponent");o(this,"editModal");o(this,"toast");o(this,"confetti");o(this,"hubBtn");o(this,"tasksBtn");o(this,"projectsBtn");o(this,"calendarBtn");o(this,"settingsBtn");o(this,"hubView");o(this,"tasksView");o(this,"projectsView");o(this,"calendarView");o(this,"settingsView");o(this,"progressRingFill");o(this,"progressPercent");o(this,"progressDetail");this.storageManager=new K,this.categorizationEngine=new _,this.itemManager=new V(this.storageManager,this.categorizationEngine),this.projectManager=new L}async initialize(){var e;try{await this.itemManager.loadItems(),this.storageManager.isStorageAvailable()||console.warn("localStorage not available"),this.initializeComponents(),this.initializeNavigation(),this.initializeProgress(),await this.itemManager.checkMissedHabits(),await this.refreshAll(),this.habitTemplatesComponent.render(),await this.habitHeatmapComponent.refresh(),await this.identityGoalsComponent.refresh(),await this.progressAnalyticsComponent.refresh(),pe(this.projectManager),this.showView("calendar"),console.log("App initialized")}catch(t){console.error("Init failed:",t),(e=this.toast)==null||e.error("Failed to initialize")}}initializeComponents(){this.toast=new le,this.confetti=new de,new Q({onSubmit:this.handleCreateItem.bind(this),categorizationEngine:this.categorizationEngine}),this.taskListComponent=new X({getItems:()=>this.itemManager.getAllItems(),onComplete:this.handleToggleComplete.bind(this),onEdit:this.handleEditItem.bind(this),onDelete:this.handleDeleteItem.bind(this)}),this.calendarComponent=new ee({getItems:()=>this.itemManager.getAllItems(),onTaskClick:this.handleEditItem.bind(this)}),this.projectsComponent=new ie({projectManager:this.projectManager,onRefresh:()=>this.projectsComponent.render()}),this.settingsComponent=new ae({onDataChange:()=>this.handleDataImport()}),this.dailyFocusComponent=new se({getItems:()=>this.itemManager.getAllItems(),onComplete:this.handleToggleComplete.bind(this),onEdit:this.handleEditItem.bind(this),onSetPriority:this.handleSetPriority.bind(this)}),this.habitTrackerComponent=new ne({getItems:()=>this.itemManager.getAllItems(),onComplete:this.handleToggleComplete.bind(this),onEdit:this.handleEditItem.bind(this)}),this.quickWinsComponent=new oe({getItems:()=>this.itemManager.getAllItems(),onComplete:this.handleToggleComplete.bind(this)}),this.weeklyReviewComponent=new M({getItems:()=>this.itemManager.getAllItems()}),this.habitTemplatesComponent=new re({onSelectTemplate:this.handleCreateItem.bind(this)}),this.habitHeatmapComponent=new P({getItems:()=>this.itemManager.getAllItems()}),this.identityGoalsComponent=new F({getItems:()=>this.itemManager.getAllItems(),onAddGoal:()=>{}}),this.progressAnalyticsComponent=new H({getItems:()=>this.itemManager.getAllItems()}),this.hubWeeklyReviewComponent=new M({getItems:()=>this.itemManager.getAllItems(),containerId:"hub-weekly-review-container"}),this.hubProgressAnalyticsComponent=new H({getItems:()=>this.itemManager.getAllItems(),containerId:"hub-progress-analytics-container"}),this.hubHabitHeatmapComponent=new P({getItems:()=>this.itemManager.getAllItems(),containerId:"hub-habit-heatmap-container"}),this.hubIdentityGoalsComponent=new F({getItems:()=>this.itemManager.getAllItems(),onAddGoal:()=>{},containerId:"hub-identity-goals-container"}),this.editModal=new ce({onSave:this.handleSaveEdit.bind(this)})}initializeNavigation(){this.hubBtn=document.getElementById("nav-hub"),this.tasksBtn=document.getElementById("nav-tasks"),this.projectsBtn=document.getElementById("nav-projects"),this.calendarBtn=document.getElementById("nav-calendar"),this.settingsBtn=document.getElementById("nav-settings"),this.hubView=document.getElementById("hub-view"),this.tasksView=document.getElementById("tasks-view"),this.projectsView=document.getElementById("projects-view"),this.calendarView=document.getElementById("calendar-view"),this.settingsView=document.getElementById("settings-view"),this.hubBtn.addEventListener("click",()=>this.showView("hub")),this.tasksBtn.addEventListener("click",()=>this.showView("tasks")),this.projectsBtn.addEventListener("click",()=>this.showView("projects")),this.calendarBtn.addEventListener("click",()=>this.showView("calendar")),this.settingsBtn.addEventListener("click",()=>this.showView("settings"))}initializeProgress(){this.progressRingFill=document.getElementById("progress-ring-fill"),this.progressPercent=document.getElementById("progress-percent"),this.progressDetail=document.getElementById("progress-detail")}async updateProgress(){const e=await this.itemManager.getAllItems(),t=new Date;t.setHours(0,0,0,0);const i=e.filter(p=>{if(p.type!=="task")return!1;const g=new Date(p.createdAt);return g.setHours(0,0,0,0),g.getTime()===t.getTime()}),a=i.length,s=i.filter(p=>p.completed).length,n=a>0?Math.round(s/a*100):0;this.progressPercent.textContent=`${n}%`,this.progressDetail.textContent=`${s} of ${a} tasks`;const r=220,l=r-n/100*r;this.progressRingFill.style.strokeDashoffset=l.toString(),a>0&&s===a&&this.confetti.fire()}showView(e){this.hubView.classList.remove("active"),this.tasksView.classList.remove("active"),this.projectsView.classList.remove("active"),this.calendarView.classList.remove("active"),this.settingsView.classList.remove("active"),this.hubBtn.classList.remove("active"),this.tasksBtn.classList.remove("active"),this.projectsBtn.classList.remove("active"),this.calendarBtn.classList.remove("active"),this.settingsBtn.classList.remove("active"),e==="hub"?(this.hubView.classList.add("active"),this.hubBtn.classList.add("active"),this.refreshHub()):e==="tasks"?(this.tasksView.classList.add("active"),this.tasksBtn.classList.add("active"),this.taskListComponent.refresh()):e==="projects"?(this.projectsView.classList.add("active"),this.projectsBtn.classList.add("active"),this.projectsComponent.render()):e==="settings"?(this.settingsView.classList.add("active"),this.settingsBtn.classList.add("active"),this.settingsComponent.render()):(this.calendarView.classList.add("active"),this.calendarBtn.classList.add("active"),this.calendarComponent.refresh())}async handleDataImport(){await this.itemManager.loadItems(),this.projectManager=new L,await this.refreshAll(),this.toast.success("Data imported successfully! Page will reload..."),setTimeout(()=>window.location.reload(),2e3)}async refreshHub(){await this.hubWeeklyReviewComponent.refresh(),await this.hubProgressAnalyticsComponent.refresh(),await this.hubHabitHeatmapComponent.refresh(),await this.hubIdentityGoalsComponent.refresh()}async refreshAll(){await this.taskListComponent.refresh(),await this.calendarComponent.refresh(),await this.dailyFocusComponent.refresh(),await this.habitTrackerComponent.refresh(),await this.quickWinsComponent.refresh(),await this.weeklyReviewComponent.refresh(),await this.habitHeatmapComponent.refresh(),await this.identityGoalsComponent.refresh(),await this.progressAnalyticsComponent.refresh(),await this.updateProgress()}async handleCreateItem(e){try{const t=await this.itemManager.createItem(e);this.toast.success(`Added: ${t.description}`),await this.refreshAll()}catch(t){throw t instanceof E?this.toast.error(t.message):this.toast.error("Failed to create item"),t}}async handleToggleComplete(e){try{const t=await this.itemManager.getItem(e);if(!t)return;if(t.completed)await this.itemManager.markIncomplete(e),this.toast.info("Marked incomplete");else{const i=await this.itemManager.markComplete(e);if(i.isHabit&&i.habitStreak){const a=i.habitStreak.currentStreak;i.habitStreak.missedYesterday?(this.toast.success("💪 Never miss twice! Back on track! +10 bonus"),this.confetti.fire()):a===1?this.toast.success("🎉 Habit started! Day 1 streak!"):a===7?(this.toast.success("🔥 7-day streak! You're on fire!"),this.confetti.fire()):a===30?(this.toast.success("🏆 30-day streak! Incredible!"),this.confetti.fire()):a%10===0?(this.toast.success(`🔥 ${a}-day streak! Keep going!`),this.confetti.fire()):this.toast.success(`✅ Habit completed! ${a}-day streak 🔥`)}else i.priority==="daily-focus"?(this.toast.success("🎯 Focus task completed! +25 points"),this.confetti.fire()):i.effortLevel==="quick"?this.toast.success("⚡ Quick win! +5 points"):this.toast.success("✅ Task completed! +10 points")}await this.refreshAll()}catch(t){this.toast.error("Failed to update"),console.error(t)}}handleEditItem(e){this.editModal.open(e)}async handleSetPriority(e,t){try{await this.itemManager.setPriority(e,t),t==="daily-focus"?this.toast.success("Added to Daily Focus"):this.toast.info("Removed from Daily Focus"),await this.refreshAll()}catch(i){this.toast.error("Failed to update priority"),console.error(i)}}async handleSaveEdit(e,t){try{await this.itemManager.updateItem(e,t),this.toast.success("Updated"),await this.refreshAll()}catch(i){throw i instanceof E?this.toast.error(i.message):this.toast.error("Failed to update"),i}}async handleDeleteItem(e){try{await this.itemManager.deleteItem(e),this.toast.info("Deleted"),await this.refreshAll()}catch(t){this.toast.error("Failed to delete"),console.error(t)}}}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(c=>{console.log("Service Worker registered:",c.scope)}).catch(c=>{console.log("Service Worker registration failed:",c)})});document.addEventListener("DOMContentLoaded",async()=>{await new he().initialize()});
