(()=>{
const $=s=>document.querySelector(s),url=window.PJ_SUPABASE_URL,key=window.PJ_SUPABASE_ANON_KEY;
const configured=url&&key&&!url.includes('YOUR_')&&!key.includes('YOUR_');
const setup=$('#setupNotice'),login=$('#loginView'),dash=$('#dashboardView'),msg=$('#authMessage');
if(!window.supabase||!configured){setup.classList.remove('hidden');msg.textContent='Add your Supabase URL and publishable/anon key to enable sign-in.';$('#loginForm').querySelector('button').disabled=true;$('#googleLogin').disabled=true;return}
const client=window.supabase.createClient(url,key);
const say=t=>msg.textContent=t;
async function adminCheck(session){
 if(!session){login.classList.remove('hidden');dash.classList.add('hidden');return}
 const {data,error}=await client.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle();
 if(error||!data){await client.auth.signOut();say('This account is not on the approved admin list.');login.classList.remove('hidden');dash.classList.add('hidden');return}
 login.classList.add('hidden');dash.classList.remove('hidden');$('#adminEmail').textContent=session.user.email||'Signed in';await loadData();
}
async function loadData(){
 $('#connectionStatus').textContent='Connected. Admin role verified by Supabase RLS.';
 const [projects,messages]=await Promise.all([client.from('projects').select('*').order('created_at',{ascending:false}),client.from('contact_messages').select('id',{count:'exact',head:true})]);
 if(projects.error){$('#connectionStatus').textContent='Database error: '+projects.error.message;return}
 const list=projects.data||[];$('#projectCount').textContent=list.length;$('#publishedCount').textContent=list.filter(p=>p.published).length;$('#messageCount').textContent=messages.count??'—';
 $('#projectList').innerHTML=list.length?list.map(p=>'<article class="project-row"><div><b>'+escapeHtml(p.title)+'</b><p>'+escapeHtml(p.category)+' · '+(p.published?'Published':'Draft')+(p.featured?' · Featured':'')+'</p></div><div class="project-actions"><button data-edit="'+p.id+'">Edit</button><button class="danger" data-delete="'+p.id+'">Delete</button></div></article>').join(''):'<p class="muted">No projects yet. Add your first verified project.</p>';
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();say('Signing in…');const {data,error}=await client.auth.signInWithPassword({email:$('#email').value,password:$('#password').value});if(error){say(error.message);return}await adminCheck(data.session)});
$('#googleLogin').addEventListener('click',async()=>{const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.href.split('?')[0]}});if(error)say(error.message)});
$('#logout').addEventListener('click',async()=>{await client.auth.signOut();login.classList.remove('hidden');dash.classList.add('hidden')});
const dialog=$('#projectDialog'),form=$('#projectForm');
function openEditor(p={}){$('#dialogTitle').textContent=p.id?'Edit project':'New project';$('#projectId').value=p.id||'';$('#projectTitle').value=p.title||'';$('#projectCategory').value=p.category||'web';$('#projectSummary').value=p.summary_en||'';$('#projectUrl').value=p.project_url||'';$('#sourceUrl').value=p.source_url||'';$('#projectFeatured').checked=!!p.featured;$('#projectPublished').checked=!!p.published;$('#projectMessage').textContent='';dialog.showModal()}
$('#addProject').addEventListener('click',()=>openEditor());
$('#cancelDialog').addEventListener('click',()=>dialog.close());
$('#projectList').addEventListener('click',async e=>{const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');if(edit){const {data,error}=await client.from('projects').select('*').eq('id',edit.dataset.edit).single();if(error){alert(error.message);return}openEditor(data)}if(del&&confirm('Delete this project permanently?')){const {error}=await client.from('projects').delete().eq('id',del.dataset.delete);if(error)alert(error.message);else await loadData()}});
form.addEventListener('submit',async e=>{e.preventDefault();const id=$('#projectId').value;const row={title:$('#projectTitle').value.trim(),category:$('#projectCategory').value,summary_en:$('#projectSummary').value.trim(),project_url:$('#projectUrl').value.trim()||null,source_url:$('#sourceUrl').value.trim()||null,featured:$('#projectFeatured').checked,published:$('#projectPublished').checked,updated_at:new Date().toISOString()};const query=id?client.from('projects').update(row).eq('id',id):client.from('projects').insert(row);const {error}=await query;if(error){$('#projectMessage').textContent=error.message;return}dialog.close();await loadData()});
client.auth.getSession().then(({data})=>adminCheck(data.session));client.auth.onAuthStateChange((_event,session)=>{if(session)adminCheck(session)});
})();
