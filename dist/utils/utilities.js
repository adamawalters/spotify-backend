"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSongDuplicates = void 0;
function removeSongDuplicates(tracks) {
    const uniqueStandardizedNames = new Set();
    const uniqueIsrcs = new Set();
    const deduplicatedTracks = tracks.filter((song => {
        const additionalInfoRegex = /(?:\([^)]*\)|-).*$/;
        const standardizedSongName = song.name
            .replace(additionalInfoRegex, "")
            .trim()
            .toLowerCase();
        if (uniqueStandardizedNames.has(standardizedSongName)) {
            return false;
        }
        else {
            uniqueStandardizedNames.add(standardizedSongName);
        }
        if (uniqueIsrcs.has(song.external_ids.isrc)) {
            return false;
        }
        else {
            uniqueIsrcs.add(song.external_ids.isrc);
        }
        return true;
    }));
    deduplicatedTracks.sort((a, b) => a.name.localeCompare(b.name));
    return deduplicatedTracks;
}
exports.removeSongDuplicates = removeSongDuplicates;
