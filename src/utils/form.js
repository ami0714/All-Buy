export function getDirtyValues(values, dirtyFields) {
   //akan reduce mengikut berapa jumlah field yang dirty,
  return Object.keys(dirtyFields).reduce((changed, key) => {
    //jika ada dirty key,maka akan letak dalam
    //  changed = value dari alldata dan cari guna dirty key

    if (dirtyFields[key]) {
      //so letak dalam changed set kan ikut dirtyField,dan amik nilai dari alldata
      //dan cari ikut key
      changed[key] = values[key];
    }
      //hantar changed ke backend
    return changed;

    //atau cara manual
    // const changed = {}
    // for(const key of Object.keys(dirtyFields)){
    //   changed[key] = values[key];
    // }
  }, {});
}
