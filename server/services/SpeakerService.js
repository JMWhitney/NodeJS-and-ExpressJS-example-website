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
      return { name: speaker.name, shortname: speaker.shortname };
    });
  }

  async getListShort() {
    const data = await this.getData();
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title };
    });
  }

  async getList() {
    const data = await this.getData();
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title, summary: speaker.summary };
    });
  }

  async getAllArtwork() {
    //Iterate through the returned artwork pieces
    //and accumulate them into one array
    const data = await this.getData();
    const artwork = data.reduce((acc, elm) => {
      if (elm.artwork) {
        acc = [...acc, ...elm.artwork];
      }
      return acc;
      //Initialize accumulator in second argument  
    }, []);
    return artwork
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakerService;