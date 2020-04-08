import * as express from "express";
import * as fs from "fs";

function staticServe(root: string) {
	return function(req: express.Request, res: express.Response, next: express.NextFunction) {
		let fullpath = root + req.path;
		sendFile(fullpath, req, res, next);
	}
}

function sendFile(path: string, req: express.Request, res: express.Response, next: express.NextFunction) {
	fs.exists(path, (exists: boolean) => {
		if (!exists) {
			next(404);
			return;
		}
		fs.stat(path, (err, stat) => {
			if (stat.isDirectory()) {
				res.redirect(req.path + "/");
				res.end();
			} else {
				let rs = fs.createReadStream(path);
				res.type(path.substr(path.lastIndexOf(".")));
				rs.on("data", (data: Buffer) => {
					res.write(data);
				});
				rs.on("end", () => {
					res.end();
					rs.close();
				});
			}

		})
	})
}

export {
	sendFile,
	staticServe
};