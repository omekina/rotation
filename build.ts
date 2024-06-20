import { $ } from "bun";


const root_files: string[] = (await $`ls -p src | grep -Pv "/$"`.quiet()).text().split("\n");


let html_entries = [];
let scss_entries = [];
let typescript_entries = [];
for (let cur_file of root_files) {
    if (/\.ts$/.test(cur_file)) { typescript_entries.push(cur_file); continue; }
    if (/\.html$/.test(cur_file)) { html_entries.push(cur_file); continue; }
    if (/\.scss$/.test(cur_file)) { scss_entries.push(cur_file); continue; }
}


async function build_html_files(files: string[]) {
    console.log("$ build html");
    const html_minifier = require("html-minifier");
    for (let cur_file of files) {
        const source_file: string = "src/" + cur_file;
        const target_file: string = "dst/" + cur_file;

        const contents = await Bun.file(source_file).text();
        const minified = html_minifier.minify(contents, {
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
        });
        await Bun.write(target_file, minified);
    }
}

async function build_scss_files(files: string[]) {
    console.log("$ build scss");
    const sass = require("sass");
    for (let cur_file of files) {
        const source_file: string = "src/" + cur_file;
        const target_file: string = "dst/" + cur_file.replace(/\.scss$/i, ".css");

        const built = sass.compile(source_file, { style: "compressed" });
        await Bun.write(target_file, built.css);
    }
}

async function build_ts_files(files: string[]) {
    console.log("$ build typescript");
    if (files.length == 0) { return; }
    let entries: string[] = [];
    for (let cur_file of files) { entries.push("src/" + cur_file); }
    const result = await Bun.build({
        entrypoints: entries,
        outdir: "dst",
        minify: true
    });
    if (!result.success) {
        console.error(result.logs);
    }
}


await build_html_files(html_entries);
await build_scss_files(scss_entries);
await build_ts_files(typescript_entries);
