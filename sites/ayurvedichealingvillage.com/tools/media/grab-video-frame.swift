// Frame extractor for tools/repair-ef12-video-frames-20260929.mjs (no ffmpeg on the build machine): exact-time frames
// at source resolution via AVFoundation, written as PNG.   swift tools/media/grab-video-frame.swift <video> <outdir> <t1,t2,...>
import AVFoundation
import AppKit
let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1]); let out = args[2]
let times = args[3].split(separator: ",").map { Double($0)! }
let asset = AVURLAsset(url: url)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
for t in times {
  let cm = CMTime(seconds: t, preferredTimescale: 600)
  do {
    let img = try gen.copyCGImage(at: cm, actualTime: nil)
    let rep = NSBitmapImageRep(cgImage: img)
    let data = rep.representation(using: .png, properties: [:])!
    try data.write(to: URL(fileURLWithPath: "\(out)/f-\(String(format: "%.2f", t)).png"))
    print("ok", t, img.width, img.height)
  } catch { print("err", t, error) }
}
