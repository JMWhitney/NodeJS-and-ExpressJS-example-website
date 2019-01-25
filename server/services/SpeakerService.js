const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

class SpeakerService {
  //This is essentially a stand in for a database.
  //Instead we will be retrieving data from a pre-supplied JSON file
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getNames() {
    const data = await this.getData();

    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname }
    });
  }

  async getListShort() {
    const data = await this.getData();
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title }
    });
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakerService;