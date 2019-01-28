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

  async getSpeakerByShortname(shortname) {
    //Grab all speakers, and find the match
    const data = await this.getData();
    const speaker = data.find(speaker => {
      return speaker.shortname === shortname;
    });
    //If no speaker found, return nothing.
    if (!speaker) return null;
    return speaker;
  }

  async getArtworkForSpeaker(shortname) {
    //Grab the matching speaker, return only the array of artwork filenames
    const speaker = await this.getSpeakerByShortname(shortname);
    const artwork = speaker.artwork
    if (!artwork) return null;
    return artwork;
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data).speakers;
  }
}


module.exports = SpeakerService;