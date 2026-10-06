import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assertArchiveMembers} from '../tools/archive-members.mjs';
const files=[{file:'public/ahv/a.png'},{file:'public/ahv/b.pdf'}];
test('Unix LF and Windows CRLF tar listings match the same exact allowlist',()=>{
  for(const newline of ['\n','\r\n']) assert.doesNotThrow(()=>assertArchiveMembers(files.map(f=>f.file).join(newline)+newline,files));
});
test('missing, duplicate, extra, traversal and renamed members fail closed',()=>{
  for(const listing of ['public/ahv/a.png\n','public/ahv/a.png\npublic/ahv/a.png\n','public/ahv/a.png\npublic/ahv/b.pdf\nextra\n','public/ahv/a.png\n../public/ahv/b.pdf\n','public/ahv/a.png\npublic/ahv/b.pdf \n']) assert.throws(()=>assertArchiveMembers(listing,files),/Unexpected archive member/);
});
