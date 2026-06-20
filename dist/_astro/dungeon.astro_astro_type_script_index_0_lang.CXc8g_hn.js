import{l as $,a as A,s as j,e as q,m as T,d as M,g as N,b as W,t as _}from"./state.BJ87hpNq.js";const D=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];function b(){const t=$(),g=N(),s=t.weeklyTasks,m=t.weeklyGrid[g]||{},e=t.dungeonLocked||!1,l=W(new Date),c=new Date(l);c.setDate(l.getDate()+6);const n={month:"short",day:"numeric",year:"numeric"},f=`${l.toLocaleDateString("en-US",n)} – ${c.toLocaleDateString("en-US",n)}`,o=document.getElementById("current-week-range");o&&(o.textContent=f);const p=document.getElementById("weekly-count-badge");p&&(p.textContent=`${s.length} Quest${s.length!==1?"s":""}`);const a=document.getElementById("dungeon-lock-btn"),h=document.getElementById("dungeon-lock-banner");a&&(e?(a.textContent="🔒 GATE: LOCKED",a.className="inline-flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer border bg-red-950/40 text-red-500 border-red-500 hover:bg-red-900/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]"):(a.textContent="🔓 GATE: ACTIVE",a.className="inline-flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer border bg-transparent text-white border-white/30 hover:bg-white/10")),h&&(e?h.classList.remove("hidden"):h.classList.add("hidden"));const w=document.getElementById("weekly-text-input"),I=document.getElementById("weekly-category-input"),v=document.getElementById("weekly-exp-input"),y=document.querySelector('#weekly-add-form button[type="submit"]'),x=e;w&&(w.disabled=!x),I&&(I.disabled=!x),v&&(v.disabled=!x),y&&(y.disabled=!x,x?(y.classList.remove("opacity-40","cursor-not-allowed","pointer-events-none"),y.classList.add("hover:bg-neutral-200")):(y.classList.add("opacity-40","cursor-not-allowed","pointer-events-none"),y.classList.remove("hover:bg-neutral-200")));const u=document.getElementById("toggle-add-template-btn");u&&(x?u.classList.remove("hidden"):u.classList.add("hidden")),H(s,e),R(s,m,g,e),U(t.templates,e)}function H(t,g){const s=document.getElementById("weekly-quests-list");if(!s)return;if(t.length===0){s.innerHTML=`
        <div class="text-center py-8 font-mono text-xs text-ink-muted border border-dashed border-hairline rounded-lg">
          No weekly recurring quests. Use the form above to initialize the dungeon.
        </div>
      `;return}const m=g;s.innerHTML="",t.forEach((e,l)=>{const c=document.createElement("div");c.className="flex gap-2 items-center bg-canvas border border-hairline hover:border-ink-muted/50 p-3 rounded-lg font-mono text-xs justify-between";const f={strength:"Attack (STR)",skills:"Skills (SKL)",intelligence:"Intellect (INT)",willpower:"Willpower (WIL)",charisma:"Charisma (CHA)"}[e.category]||e.category,o=l===0,p=l===t.length-1;c.innerHTML=`
        <div class="flex-1 min-w-0">
          <p class="text-white font-medium truncate">${e.text}</p>
          <p class="text-[9px] text-ink-muted uppercase">${f} • +${e.exp} EXP</p>
        </div>
        ${m?`
        <div class="flex gap-1.5 ml-2">
          <button type="button" aria-label="Move objective up" class="move-weekly-up-btn text-white hover:text-neutral-200 text-[10px] bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-2.5 py-1.5 rounded cursor-pointer transition-all min-h-[36px] min-w-[28px] ${o?"opacity-25 pointer-events-none":""}" title="Move Quest Up">
            ▲
          </button>
          <button type="button" aria-label="Move objective down" class="move-weekly-down-btn text-white hover:text-neutral-200 text-[10px] bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-2.5 py-1.5 rounded cursor-pointer transition-all min-h-[36px] min-w-[28px] ${p?"opacity-25 pointer-events-none":""}" title="Move Quest Down">
            ▼
          </button>
          <button type="button" aria-label="Edit objective" class="edit-weekly-btn text-white hover:text-neutral-200 text-[10px] bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-3 py-1.5 rounded cursor-pointer transition-all ml-1 min-h-[36px]">
            Edit
          </button>
          <button type="button" aria-label="Delete objective" class="delete-weekly-btn text-red-500 hover:text-red-400 text-[10px] bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-3 py-1.5 rounded cursor-pointer transition-all min-h-[36px]">
            Del
          </button>
        </div>
        `:""}
      `,m&&(c.querySelector(".move-weekly-up-btn").addEventListener("click",()=>{T(e.id,"up"),b()}),c.querySelector(".move-weekly-down-btn").addEventListener("click",()=>{T(e.id,"down"),b()}),c.querySelector(".edit-weekly-btn").addEventListener("click",()=>{const a=prompt("Edit quest objective description:",e.text);a!==null&&a.trim()&&(q(e.id,a.trim(),e.category,e.exp),b())}),c.querySelector(".delete-weekly-btn").addEventListener("click",()=>{confirm(`Remove "${e.text}" and delete all records for this week?`)&&(M(e.id),b())})),s.appendChild(c)})}function R(t,g,s,m){const e=document.getElementById("weekly-grid-body");if(!e)return;if(t.length===0){e.innerHTML=`
        <tr>
          <td colspan="8" class="p-6 text-center text-ink-muted italic border border-hairline bg-surface-1/40">
            Dungeon is currently empty. Configure recurring quests to open cells.
          </td>
        </tr>
      `,D.forEach(n=>{const f=document.getElementById(`pct-${n}`),o=document.getElementById(`rank-${n}`);f&&(f.textContent="0%"),o&&(o.textContent="E",o.className="border border-hairline p-3 text-center text-sm font-display text-ink-muted")});return}e.innerHTML="";const l={Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0};t.forEach((n,f)=>{const o=document.createElement("tr");o.className="hover:bg-surface-2/20 transition-all group/row";const p=g[n.id]||{},a=f===0,h=f===t.length-1,w=m;let I=`
        <td class="border border-hairline p-3 font-medium text-white max-w-[150px] sm:max-w-xs text-center align-middle group/row" title="${n.text}">
          <div class="flex items-center justify-center gap-2 relative w-full">
            <span class="truncate select-none">${n.text}</span>
            ${w?`
            <!-- Desktop Action Buttons -->
            <div class="hidden md:flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-all duration-200 shrink-0">
              <button 
                type="button" 
                aria-label="Move quest up"
                class="move-weekly-row-up-btn text-white hover:text-neutral-200 bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-all ${a?"opacity-25 pointer-events-none":""}" 
                data-task-id="${n.id}"
                title="Move quest up"
              >
                ▲
              </button>
              <button 
                type="button" 
                aria-label="Move quest down"
                class="move-weekly-row-down-btn text-white hover:text-neutral-200 bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-all ${h?"opacity-25 pointer-events-none":""}" 
                data-task-id="${n.id}"
                title="Move quest down"
              >
                ▼
              </button>
              <button 
                type="button" 
                aria-label="Edit quest objective"
                class="edit-weekly-row-btn text-white hover:text-neutral-200 bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-all ml-1" 
                data-task-id="${n.id}"
                title="Edit quest objective"
              >
                ✎
              </button>
              <button 
                type="button" 
                aria-label="Remove quest from dungeon"
                class="delete-weekly-row-btn text-red-500 hover:text-red-400 bg-surface-2 hover:bg-neutral-900 border border-hairline/25 px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-all" 
                data-task-id="${n.id}"
                title="Remove quest from dungeon"
              >
                ✕
              </button>
            </div>
            <!-- Mobile 3-Dots Button -->
            <button 
              type="button" 
              class="md:hidden text-ink-muted hover:text-white px-2 py-0.5 font-bold text-sm focus:outline-none flex items-center justify-center cursor-pointer select-none rounded hover:bg-surface-2" 
              data-mobile-dots-id="${n.id}"
              aria-label="Open options for ${n.text}"
            >
              ⋮
            </button>
            `:""}
          </div>
        </td>
      `;if(D.forEach(v=>{const y=p[v]||"incomplete";y==="completed"&&l[v]++;let x="",u="w-9 h-9 sm:w-8 sm:h-8 rounded border border-hairline bg-canvas/30 transition-all duration-200 flex items-center justify-center text-[10px] font-bold text-ink-muted focus-visible:ring-1 focus-visible:ring-white focus:outline-none";const E=!m;E?u+=" hover:border-white cursor-pointer":u+=" cursor-not-allowed opacity-80",y==="completed"?(x="✓",u="w-9 h-9 sm:w-8 sm:h-8 rounded border border-white bg-white/10 text-white font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.25)] transition-all duration-200 focus-visible:ring-1 focus-visible:ring-white focus:outline-none",E?u+=" hover:scale-105 cursor-pointer":u+=" cursor-not-allowed opacity-80"):y==="missed"&&(x="✗",u="w-9 h-9 sm:w-8 sm:h-8 rounded border border-red-500 bg-red-950/40 text-red-400 font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.3)] transition-all duration-200 focus-visible:ring-1 focus-visible:ring-white focus:outline-none",E?u+=" hover:scale-105 cursor-pointer":u+=" cursor-not-allowed opacity-80"),I+=`
          <td class="border border-hairline p-3 text-center">
            <div class="flex items-center justify-center">
              <button 
                type="button" 
                data-task-id="${n.id}" 
                data-day="${v}" 
                aria-label="Cycle status for ${v} on quest: ${n.text}"
                class="weekly-cell-btn ${u}"
                title="${v} status: Click to cycle status"
              >
                ${x}
              </button>
            </div>
          </td>
        `}),o.innerHTML=I,!m){o.querySelectorAll(".weekly-cell-btn").forEach(i=>{i.addEventListener("click",()=>{const r=i.getAttribute("data-task-id"),d=i.getAttribute("data-day");r&&d&&(_(s,r,d),b())})});const y=o.querySelector(".move-weekly-row-up-btn");y&&y.addEventListener("click",i=>{i.stopPropagation();const r=y.getAttribute("data-task-id");r&&(T(r,"up"),b())});const x=o.querySelector(".move-weekly-row-down-btn");x&&x.addEventListener("click",i=>{i.stopPropagation();const r=x.getAttribute("data-task-id");r&&(T(r,"down"),b())});const u=o.querySelector(".edit-weekly-row-btn");u&&u.addEventListener("click",i=>{i.stopPropagation();const r=u.getAttribute("data-task-id");if(r){const d=prompt("Edit quest objective description:",n.text);d!==null&&d.trim()&&(q(r,d.trim(),n.category,n.exp),b())}});const E=o.querySelector(".delete-weekly-row-btn");E&&E.addEventListener("click",i=>{i.stopPropagation();const r=E.getAttribute("data-task-id");r&&confirm(`Remove "${n.text}" and delete all records for this week?`)&&(M(r),b())})}e.appendChild(o)});const c=t.length;D.forEach(n=>{const f=l[n],o=c>0?Math.round(f/c*100):0;let p="E",a="text-ink-muted";o>=90?(p="S",a="text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]"):o>=80?(p="A",a="text-purple-400"):o>=70?(p="B",a="text-blue-400"):o>=60?(p="C",a="text-green-400"):o>=40&&(p="D",a="text-white");const h=document.getElementById(`pct-${n}`);h&&(h.textContent=`${o}%`);const w=document.getElementById(`rank-${n}`);w&&(w.textContent=p,w.className=`border border-hairline p-3 text-center text-sm font-display font-bold ${a}`)})}function U(t,g){const s=document.getElementById("templates-list-container");if(!s)return;if(!t||t.length===0){s.innerHTML=`
        <div class="col-span-2 text-center py-4 font-mono text-[9px] text-ink-muted border border-dashed border-hairline rounded-lg">
          No templates. Click '+ Create Preset' to add.
        </div>
      `;return}const m=g;s.innerHTML="",t.forEach(e=>{const l=document.createElement("div");l.className="flex items-center gap-1 bg-canvas border border-hairline p-2 rounded font-mono text-[10px] transition-all justify-between group",m?l.className+=" hover:border-white":l.className+=" opacity-60 cursor-not-allowed";const n={strength:"Attack",skills:"Skills",intelligence:"Intellect",willpower:"Willpower",charisma:"Charisma"}[e.category]||e.category;l.innerHTML=`
        <div class="flex-1 min-w-0 ${m?"cursor-pointer add-preset-to-weekly-btn":"cursor-not-allowed"}" data-id="${e.id}">
          <p class="text-white font-medium truncate">${e.text}</p>
          <p class="text-[8px] text-ink-muted uppercase">${n} • +${e.exp} EXP</p>
        </div>
        ${m?`
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
          <button type="button" class="edit-preset-btn text-white hover:underline text-[8px] font-mono cursor-pointer" data-id="${e.id}">Edit</button>
          <button type="button" class="delete-preset-btn text-red-500 hover:underline text-[8px] font-mono cursor-pointer" data-id="${e.id}">Del</button>
        </div>
        `:""}
      `,m&&(l.querySelector(".add-preset-to-weekly-btn").addEventListener("click",()=>{A(e.text,e.category,e.exp),b()}),l.querySelector(".edit-preset-btn").addEventListener("click",f=>{f.stopPropagation(),G(e)}),l.querySelector(".delete-preset-btn").addEventListener("click",f=>{if(f.stopPropagation(),confirm("Delete this preset template?")){const o=$();o.templates=o.templates.filter(p=>p.id!==e.id),j(o),b()}})),s.appendChild(l)})}function G(t){const g=document.getElementById("template-editor-panel"),s=document.getElementById("template-editor-title"),m=document.getElementById("edit-template-id"),e=document.getElementById("template-name-input"),l=document.getElementById("template-category-select"),c=document.getElementById("template-exp-input");!g||!m||!e||!l||!c||(s.textContent="Edit Preset",m.value=t.id,e.value=t.text,l.value=t.category,c.value=t.exp.toString(),g.classList.remove("hidden"),e.focus())}document.addEventListener("DOMContentLoaded",()=>{b();const t=document.getElementById("dungeon-lock-btn"),g=document.getElementById("dungeon-banner-unlock-btn");function s(){const i=$(),r=!i.dungeonLocked;confirm(r?"Close & Lock the Dungeon Gate? This allows you to add, edit, or reorder quests, but freezes all progress completions for this week. Proceed?":"Activate & Open the Dungeon Gate? This seals quest configurations to begin the raid (allowing progress logging, but locking editing). Proceed?")&&(i.dungeonLocked=r,j(i),b())}t&&t.addEventListener("click",s),g&&g.addEventListener("click",s);const m=document.getElementById("weekly-add-form");m&&m.addEventListener("submit",i=>{if(i.preventDefault(),!$().dungeonLocked){alert("The gate is active. You must toggle the gate to LOCKED (Closed) to configure objectives.");return}const d=document.getElementById("weekly-text-input"),L=document.getElementById("weekly-category-input"),S=document.getElementById("weekly-exp-input");if(d&&L&&S){const B=d.value.trim(),O=L.value,P=parseInt(S.value)||10;B&&(A(B,O,P),d.value="",d.focus(),b())}});const e=document.getElementById("toggle-add-template-btn"),l=document.getElementById("template-editor-panel"),c=document.getElementById("cancel-template-btn"),n=document.getElementById("save-template-btn"),f=document.getElementById("template-editor-title"),o=document.getElementById("edit-template-id"),p=document.getElementById("template-name-input"),a=document.getElementById("template-category-select"),h=document.getElementById("template-exp-input");e&&l&&c&&n&&(e.addEventListener("click",()=>{if(!$().dungeonLocked){alert("The gate is active. You must toggle the gate to LOCKED (Closed) to configure presets.");return}f.textContent="New Preset",o.value="",p.value="",a.value="willpower",h.value="10",l.classList.toggle("hidden"),l.classList.contains("hidden")||p.focus()}),c.addEventListener("click",()=>{l.classList.add("hidden")}),n.addEventListener("click",()=>{const i=$();if(!i.dungeonLocked){alert("The gate is active. You must toggle the gate to LOCKED (Closed) to configure presets.");return}const r=p.value.trim(),d=a.value,L=parseInt(h.value)||10,S=o.value;if(!r){alert("Please enter a title for the template preset.");return}if(S)i.templates=i.templates.map(B=>B.id===S?{...B,text:r,category:d,exp:L}:B);else{const B={id:"t-custom-"+Date.now(),text:r,category:d,exp:L};i.templates.push(B)}j(i),l.classList.add("hidden"),b()}));const w=document.getElementById("cancel-mobile-modal-btn"),I=document.getElementById("close-mobile-modal-btn"),v=document.getElementById("mobile-action-modal");w&&w.addEventListener("click",C),I&&I.addEventListener("click",C),v&&v.addEventListener("click",i=>{i.target===v&&C()});const y=document.getElementById("modal-btn-edit");y&&y.addEventListener("click",()=>{if(!k)return;const r=$().weeklyTasks.find(L=>L.id===k);if(!r)return;const d=prompt("Edit quest description:",r.text);d!==null&&d.trim()&&(q(r.id,d.trim(),r.category,r.exp),C(),b())});const x=document.getElementById("modal-btn-up");x&&x.addEventListener("click",()=>{k&&(T(k,"up"),C(),b())});const u=document.getElementById("modal-btn-down");u&&u.addEventListener("click",()=>{k&&(T(k,"down"),C(),b())});const E=document.getElementById("modal-btn-delete");E&&E.addEventListener("click",()=>{if(!k)return;const r=$().weeklyTasks.find(L=>L.id===k),d=r?r.text:"";confirm(`Remove "${d}" and delete all records for this week?`)&&(M(k),C(),b())})});let k=null;function C(){const t=document.getElementById("mobile-action-modal"),g=t?t.querySelector(".transform"):null;!t||!g||(g.classList.remove("translate-y-0"),g.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex"),k=null},300))}
