async function start() {
	let res = await fetch("./cases.csv");
	let text = await res.text();
	// console.log(text);
	let table = text.split('\n');
	let header = table[0].split(',');
	let rows = table.splice(1).map(row => {
		let r = row.split(',');
		let _r = {};
		header.forEach((col, idx) => {
			_r[col] = r[idx];
		});
		return _r;
	});
	console.log(header);
	console.log(rows);
	let t = new tracker(rows);
	console.log(t);
	createChart();
}


function createChart() {
	let myChart = new Chart("chart")
}




class tracker {

	constructor(data) {
		this.countries = {};
		for (let row of data) {
			if (!(row.countryterritoryCode in this.countries)) {
				this.countries[row.countryterritoryCode] = new country(row.countriesAndTerritories, row.countryterritoryCode, row.geoId);
			}
			this.countries[row.countryterritoryCode].addCases(row.dateRep, row.cases, row.deaths);
		}
	}
}

class country {
	constructor(name, terr_code, geoId) {
		this.name = name;
		this.territory_code = terr_code;
		this.geoId = geoId;
		this.cases = {};
	}

	addCases(date, cases, deaths) {
		let d = date.split('/');
		this.cases[`${d[2]}/${d[1]}/${d[0]}`] = {
			cases: cases,
			deaths: deaths,
		}
	}

	getCases() {
		return this.cases;
	}
}



window.onload = start;