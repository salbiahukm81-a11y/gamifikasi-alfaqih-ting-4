window.LESSON={
id:'p14',no:14,bidang:'Fiqh',title:'Sembelihan',game:'Inspektor Halal',
theme:{a:'#4ADE80',b:'#F87171',icon:'🔪'},
hero:{ar:'مَا أَنْهَرَ الدَّمَ وَذُكِرَ اسْمُ اللَّهِ عَلَيْهِ فَكُلُوهُ',ms:'“Setiap yang ditumpahkan darahnya dengan menyebut nama Allah, maka makanlah.” (Riwayat al-Bukhari)'},
ranks:['Ketua Inspektor Halal','Inspektor Kanan','Inspektor Halal','Inspektor Pelatih'],
cert:{title:'SIJIL INSPEKTOR HALAL',ar:'إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ',ms:'“Sesungguhnya Allah menetapkan perbuatan baik (ihsan) atas segala sesuatu…” (Riwayat Muslim daripada Syaddad bin Aus)'},
stages:[
{type:'sort',emo:'🧾',name:'Senarai Semak Rukun',badge:'Penyemak Rukun',brief:'Rukun sembelihan: penyembelih, binatang sembelihan dan alat sembelihan. Kenal pasti syarat atau sunat itu milik rukun mana!',bins:[{name:'Penyembelih',emo:'🧑',c:0},{name:'Binatang Sembelihan',emo:'🐄',c:2},{name:'Alat Sembelihan',emo:'🔪',c:1}],data:[
 {t:'Beragama Islam atau ahli kitab',b:0},{t:'Melakukan penyembelihan hanya kerana Allah',b:0},{t:'Sunat membaca basmalah ketika memulakan sembelihan',b:0},{t:'Sunat menghadap kiblat',b:0},{t:'Sunat menyembelih pada waktu siang',b:0},
 {t:'Masih mempunyai hayah mustaqirrah',b:1},{t:'Putus urat halkum dan urat mari\' sekali gus dan sekali sembelihan',b:1},{t:'Sunat dibaringkan pada rusuk kiri',b:1},
 {t:'Alat yang boleh melukakan binatang kecuali kuku, gigi dan tulang',b:2},{t:'Sunat menggunakan alat yang tajam seperti pisau',b:2},{t:'Makruh menggunakan pisau yang tumpul',b:2}]},
{type:'sort',emo:'✅',name:'Sunat atau Makruh?',badge:'Penilai Amalan',brief:'Nilai setiap tindakan: SUNAT atau MAKRUH dalam sembelihan?',bins:[{name:'Sunat',emo:'👍',c:2},{name:'Makruh',emo:'👎',c:1}],data:[
 {t:'Membaca basmalah',b:0},{t:'Menghadap kiblat',b:0},{t:'Menyembelih pada waktu siang',b:0},{t:'Menajamkan pisau sebelum menyembelih',b:0},{t:'Membaringkan binatang pada rusuk kiri',b:0},{t:'Menggunakan alat yang tajam seperti pisau',b:0},
 {t:'Tidak membaca basmalah',b:1},{t:'Tidak menghadap kiblat',b:1},{t:'Menyembelih pada waktu malam',b:1},{t:'Menyembelih di hadapan binatang lain',b:1},{t:'Menajamkan pisau di hadapan binatang',b:1},{t:'Mengheret kaki binatang ke tempat sembelihan',b:1},{t:'Menggunakan pisau yang tumpul',b:1}]},
{type:'match',emo:'🃏',name:'Kamus Sembelihan',badge:'Pakar Istilah',back:'🔪',brief:'Padankan istilah dengan maksudnya.',data:[
 ['Sembelihan (istilah)','Menyembelih binatang halal dengan memutuskan urat halkum dan urat mari\''],
 ['Urat halkum','Saluran pernafasan'],['Urat mari\'','Saluran makanan'],
 ['Ahli kitab','Keturunan Bani Israel yang beragama Yahudi dan Nasrani'],
 ['Hayah mustaqirrah','Haiwan mampu bergerak dengan bertenaga, meronta-ronta kuat setelah disembelih'],
 ['Ihsan','Perbuatan baik yang ditetapkan Allah atas segala sesuatu'],
 ['Water stunner','Digunakan dalam penyembelihan ayam – hukumnya harus']]},
{type:'tf',emo:'⚖️',name:'Audit Halal',badge:'Juruaudit Halal',brief:'Benar atau salah? Audit setiap kenyataan!',data:[
 {t:'Hukum sembelihan ialah wajib supaya halal dimakan dagingnya.',a:true},
 {t:'Sembelihan untuk membuat persembahan kepada kubur keramat adalah halal.',a:false,ex:'Sembelihan bukan kerana Allah adalah haram dan tidak sah.'},
 {t:'Sembelihan kanak-kanak yang mumayyiz dan perempuan adalah sah dan halal.',a:true},
 {t:'Jika binatang disembelih ketika hampir mati, binatang tersebut tidak halal dimakan.',a:true,ex:'Binatang mesti masih mempunyai hayah mustaqirrah.'},
 {t:'Menyembelih menggunakan gigi atau kuku adalah sah.',a:false,ex:'Alat sembelihan tidak boleh kuku, gigi dan tulang.'},
 {t:'Apabila kedua-dua urat diputuskan segera, binatang akan mati dengan cepat.',a:true},
 {t:'Janin yang mati selepas ibunya disembelih adalah halal dimakan dagingnya.',a:true,ex:'Spektrum Ilmu.'},
 {t:'Darah binatang mengandungi toksin dan bakteria; sembelihan mengeluarkannya.',a:true,ex:'Hikmah dari sudut sains.'},
 {t:'Penggunaan electrical stunning dalam penyembelihan lembu adalah haram menurut Muzakarah Jawatankuasa Fatwa 1988.',a:false,ex:'Hukumnya harus.'},
 {t:'Mematahkan leher binatang sebelum ia mati termasuk menyeksa binatang.',a:true},
 {t:'Disunatkan menyembelih pada waktu siang kerana dikhuatiri berlaku kesilapan pada waktu malam.',a:true},
 {t:'Dalil sembelihan dalam al-Quran ialah Surah al-Maidah, ayat 3.',a:true}]},
{type:'boss',emo:'🔪',name:'Siasatan Kilang',badge:'Inspektor Halal',boss:{name:'SINDIKET SYUBHAH',emo:'🕵️‍♂️'},brief:'Sindiket Syubhah menjual daging tidak sah! Bongkar mereka dengan ilmu fiqh.',data:[
 {q:'Apakah maksud sembelihan dari segi bahasa?',o:['Memotong','Membunuh','Memasak','Membersihkan'],a:0},
 {q:'Siapakah perawi hadis “Setiap yang ditumpahkan darahnya dengan menyebut nama Allah, maka makanlah”?',o:['Rafi\' bin Khadij','Syaddad bin Aus','Abu Ya\'la','Abu Hurairah'],a:0},
 {q:'Rukun sembelihan ialah…',o:['Penyembelih, binatang sembelihan dan alat sembelihan','Niat, takbir dan salam','Air, pisau dan tali','Imam, makmum dan kiblat'],a:0},
 {q:'Menurut hadis Syaddad bin Aus, apabila menyembelih kita hendaklah…',o:['Menajamkan pisau dan menenangkan binatang sembelihan','Menyembelih secepat mungkin tanpa basmalah','Menyeksa binatang','Menyembelih di hadapan binatang lain'],a:0},
 {q:'Urat yang wajib diputuskan dalam sembelihan ialah…',o:['Urat halkum dan urat mari\'','Urat nadi kaki','Urat jantung','Urat ekor'],a:0},
 {q:'Sembelihan ahli kitab halal kerana…',o:['Niat sembelihan mereka adalah kerana Allah','Mereka kaya','Mereka berjiran','Mereka mahir'],a:0},
 {q:'Antara hikmah sembelihan dari sudut syarak ialah…',o:['Membezakan daging yang halal dengan yang haram supaya ibadah diterima','Menambah berat daging','Menjimatkan masa','Menjadikan daging lebih murah'],a:0},
 {q:'Mengapakah disunatkan menghadap kiblat ketika menyembelih?',o:['Kiblat ialah tempat yang mulia bagi umat Islam','Supaya lebih cepat','Kerana arah matahari','Supaya binatang tidak lari'],a:0},
 {q:'Situasi: Pekerja kilang memukul ayam selepas disembelih untuk mempercepat kematiannya. Perbuatan ini…',o:['Menyeksa binatang dan bertentangan dengan ihsan','Sunat','Wajib','Tiada kaitan'],a:0},
 {q:'Situasi: Pak Hassan menyembelih lembu di hadapan lembu-lembu lain. Hukumnya…',o:['Makruh','Sunat','Wajib','Membatalkan sembelihan'],a:0},
 {q:'Situasi: Seekor kambing disembelih tetapi hanya urat halkum yang terputus. Sembelihan itu…',o:['Tidak memenuhi syarat sah kerana urat mari\' tidak terputus','Sah sepenuhnya','Sunat','Makruh sahaja'],a:0},
 {q:'Hayah mustaqirrah ditandakan dengan binatang…',o:['Meronta-ronta dengan kuat setelah disembelih','Diam tidak bergerak','Tidur','Mengeluarkan bunyi sahaja'],a:0}]}
],
review:[
 {h:'Maksud, Hukum & Dalil',items:['Bahasa: memotong. Istilah: menyembelih binatang yang halal dimakan dagingnya dengan memutuskan urat halkum dan urat mari\'.','Hukum: wajib (supaya halal dimakan dagingnya).','Dalil: al-Maidah: 3; hadis Rafi\' bin Khadij (Riwayat al-Bukhari).']},
 {h:'Rukun',items:['Penyembelih, binatang sembelihan, alat sembelihan.']},
 {h:'Syarat Sah',items:['Penyembelih: beragama Islam atau ahli kitab; menyembelih hanya kerana Allah.','Binatang: masih mempunyai hayah mustaqirrah; putus urat halkum (saluran pernafasan) dan urat mari\' (saluran makanan) sekali gus.','Alat: boleh melukakan binatang kecuali kuku, gigi dan tulang.']},
 {h:'Perkara Sunat',items:['Membaca basmalah; menghadap kiblat; menyembelih pada waktu siang; menajamkan pisau (hadis Abu Ya\'la); membaringkan binatang pada rusuk kiri; alat yang tajam.']},
 {h:'Perkara Makruh',items:['Tidak membaca basmalah; tidak menghadap kiblat; menyembelih pada waktu malam; menyembelih di hadapan binatang lain; menyeksa binatang; pisau tumpul.']},
 {h:'Hikmah',items:['Membezakan daging halal dengan haram supaya ibadah diterima.','Menghindarkan penyakit kerana toksin dan bakteria dalam darah dikeluarkan.','Mempercepat proses kematian binatang.','Fatwa 1988: water stunner (ayam) dan electrical stunning (lembu) adalah harus.']}]
};
