function test() {
	const theme = 'forest';
	const config = {
		logLevel: 5,
		startOnLoad: false,
		arrowMarkerAbsolute: false,
		theme: theme,
		flowchart: {},
		sequenceDiagram: {},
		gantt: {
			titleTopMargin: 25,
			barHeight: 20,
			barGap: 4,
			topPadding: 50,
			leftPadding: 75,
			gridLineStartPadding: 35,
			fontSize: 11,
			fontFamily: '"Open-Sans", "sans-serif"',
			numberSectionStyles: 3,
			axisFormatter: [
				['%I:%M', d => d.getHours()],
				['w. %U', d => d.getDay() === 1],
				['%a %d', d => d.getDay() && d.getDate() !== 1],
				['%b %d', d => d.getDate() !== 1],
				['%m-%y', d => d.getMonth()],
			],
		},
		classDiagram: {},
		gitGraph: {},
		info: {}
	}
	const content = 'graph TD\nsubgraph CDN节点\nB\nC\nend\nB --> C';
	const path = require('path');
	const fs = require('fs');
	const puppeteer = require('puppeteer');
	(async () => {
		const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
		const page = await browser.newPage();
		await page.goto(`file://${path.join(__dirname, 'index.html')}`);
		const result = await page.$eval('#container', (container, content, config) => {
			container.innerHTML = content;
			const mermaidAPI = window.mermaid.mermaidAPI;
			mermaidAPI.initialize(config);
			var cb = function(svgGraph) {
				console.log('render finished!');
			};
			var svgGraph = mermaidAPI.render('id1',content,cb);
			return svgGraph;
		}, content, config);
		console.log(result);
		await fs.writeFile('./mermaidSvgGraph.txt', result, (err) => {
			if(err) {
				console.error(err);
			}
		})
		await browser.close();
	})();
}

test();
