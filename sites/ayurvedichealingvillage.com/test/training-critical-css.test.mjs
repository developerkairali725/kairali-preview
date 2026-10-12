import test from "node:test";
import assert from "node:assert/strict";
import { inlineTrainingCss } from "../tools/inline-training-critical-css.mjs";
const flight='<script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,"unchanged"])</script>';
const link='<link rel="stylesheet" href="/_next/static/css/abcdef.css" data-precedence="next"/>';
test("training CSS preserves exact content/order and every byte of Flight",()=>{
 const css='p{color:red}\nh1{font-size:2rem}';const result=inlineTrainingCss('<head>'+link+'</head><body>Approved</body>'+flight,()=>css);
 assert.equal(result.html,'<head><style data-precedence="next" data-href="/_next/static/css/abcdef.css">'+css+'</style></head><body>Approved</body>'+flight);
 assert.equal(result.records.length,1);assert.equal(result.records[0].cssBytes,Buffer.byteLength(css));
});
test("unexpected framework output fails closed before publication",()=>{
 assert.throws(()=>inlineTrainingCss(link,()=>"p{}"),/Flight/);
 assert.throws(()=>inlineTrainingCss(flight,()=>"p{}"),/No original/);
 assert.throws(()=>inlineTrainingCss(link+flight,()=>"</style><script>"),/Unsafe/);
 assert.throws(()=>inlineTrainingCss(link.replace('data-precedence="next"','')+flight,()=>"p{}"),/precedence/);
});

test("English custom layout with no framework CSS remains byte-identical only when explicitly allowed",()=>{
 const html='<head></head><body>Approved</body>'+flight;
 assert.deepEqual(inlineTrainingCss(html,()=>{throw Error("unexpected read")},{allowNoStylesheets:true}),{html,records:[]});
 assert.throws(()=>inlineTrainingCss(html,()=>"p{}"),/No original/);
});
