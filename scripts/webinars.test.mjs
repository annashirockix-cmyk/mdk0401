import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const api=readFileSync(new URL("../api.js",import.meta.url),"utf8");
const gs=readFileSync(new URL("../Code.gs",import.meta.url),"utf8");
const js=readFileSync(new URL("../webinars.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const sw=readFileSync(new URL("../service-worker.js",import.meta.url),"utf8");

test("webinar API routes are exposed through the authenticated API client",()=>{
 for(const action of ["getWebinars","createWebinar","joinWebinar","webinarAttendance"])assert.ok(api.includes(action));
 for(const route of ['case "getwebinars"','case "createwebinar"','case "joinwebinar"','case "webinarattendance"'])assert.ok(gs.includes(route));
});

test("webinar records use dedicated schedule and attendance sheets",()=>{
 assert.match(gs,/Webinars: \["WebinarId", "CourseId", "Title", "Description", "StartsAt", "RoomName", "Status", "CreatedBy", "CreatedAt"\]/);
 assert.match(gs,/WebinarAttendance: \["WebinarId", "Email", "Name", "Event", "FirstJoinedAt", "LastLeftAt", "UpdatedAt"\]/);
});

test("server authorizes webinar creation and course-scoped joining",()=>{
 assert.match(gs,/function createWebinar_\(data\)[\s\S]*?editor_\(data,courseId\)/);
 assert.match(gs,/function joinWebinar_\(data\)[\s\S]*?auth_\(data\)[\s\S]*?hasCourseAccess_\(user,w\.courseId\)/);
 assert.match(gs,/function webinarAttendance_\(data\)[\s\S]*?hasCourseAccess_\(user,w\.courseId\)/);
});

test("only webinar creator or admin receives moderator privileges",()=>{
 assert.ok(gs.includes('const isHost=user.role==="admin"||(user.role==="teacher"&&w.createdBy===user.email);'));
});

test("Jitsi rooms can be secured with server-signed JWT tokens",()=>{
 assert.match(gs,/JITSI_APP_ID/);
 assert.match(gs,/JITSI_APP_SECRET/);
 assert.match(gs,/computeHmacSha256Signature/);
 assert.match(gs,/moderator:!!isHost/);
 assert.match(gs,/secure:!!jwt/);
});

test("webinar page provides host scheduling, student join and embedded room controls",()=>{
 for(const feature of ["Создать вебинар","Войти в вебинар","JitsiMeetExternalAPI","participantJoined","participantLeft","desktop","chat","raisehand"])assert.ok(js.includes(feature));
 assert.ok(html.includes('href="#/webinars"'));
 assert.match(html,/webinars\.js/);
 assert.match(html,/webinars\.css/);
 assert.match(sw,/\.\/webinars\.js/);
 assert.match(sw,/\.\/webinars\.css/);
});

 
test("webinar UI does not promise recording without a configured recording service",()=>{
 assert.ok(js.includes("webinar-record-note"));
 assert.ok(js.includes("требуется настройка сервера записи"));
 assert.ok(!js.includes("startRecording"));
 assert.ok(!js.includes('"recording"'));
});
