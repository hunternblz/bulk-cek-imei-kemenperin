const readlineSync = require("readline-sync");
const fs = require('fs')
const colors = require('colors');
const axios = require('axios');

async function Check(imei) {
	let hasil = await Checkk(imei);
	return hasil;
}
function Checkk(imei) {
	return new Promise(resolve => {
		axios.request({
			url: "https://api.nabil.my.id/cekImeiKemenperin",
			method: "POST",
			data: 'imei=' + imei
		}).then(hasil => {
			hasil = JSON.stringify(hasil.data);
			hasil = JSON.parse(hasil);
			resolve(hasil);
		}).catch(function (e) {
			resolve(e.response.data);
		});
	});
}

console.clear();
console.log("——————————————————————————————————————————————————");
console.log("Tools    : Bulk Cek IMEI Kemenperin".cyan);
console.log("Author   : Muhammad Nabil".cyan);
console.log("Facebook : fb.com/Official.Real.HunterNblz".cyan);
console.log("——————————————————————————————————————————————————");
fileImei = readlineSync.question(" [?] File List (ex: imei.txt) > ".yellow);
if (fs.existsSync(fileImei)) {
	fileImei = fs.readFileSync(fileImei).toString();
	fileImei = fileImei.split(/\r\n|\r|\n/);
	console.log(` [!] Total IMEI : ${fileImei.length} [!]`.cyan);
	console.log("——————————————————————————————————————————————————");
	x = 0;
	for (var i = 0; i < fileImei.length; i++) {
		const imei = fileImei[i];
		setTimeout(function () {
			Check(imei).then(hasil => {
				x++;
				if (hasil['status'] == 'success') {
					console.log(` ${x}.[✔] TERDAFTAR => ${imei}`.green);
					fs.appendFileSync('Imei-Terdaftar.txt', imei + "\n");
				} else {
					console.log(` ${x}.[✖] TIDAK TERDAFTAR => ${imei}`.red);
					fs.appendFileSync('Imei-Tidak-Terdaftar.txt', imei + "\n");
				}
				if (x == fileImei.length) { console.log("——————————————————————————————————————————————————"); }
			}).catch(err => {
				console.log(err);
			});
		}, i * 1000);
	}
} else {
	console.log(" [!] File Tidak Ada [!]".red);
}