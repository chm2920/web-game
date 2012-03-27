// JavaScript Document

function $(v){return document.getElementById(v);}

var data = {
	years: {
		1941 : "0.6",
		1942 : "0.8",
		1943 : "0.7",
		1944 : "0.5",
		1945 : "1.5",
		1946 : "0.6",
		1947 : "1.6",
		1948 : "1.5",
		1949 : "0.7",
		1950 : "0.9",
		1951 : "1.2",
		1952 : "1",
		1953 : "0.7",
		1954 : "1.5",
		1955 : "0.6",
		1956 : "0.5",
		1957 : "1.4",
		1958 : "1.4",
		1959 : "0.9",
		1960 : "0.7",
		1961 : "0.7",
		1962 : "0.9",
		1963 : "1.2",
		1964 : "0.8",
		1965 : "0.7",
		1966 : "1.3",
		1967 : "0.5",
		1968 : "1.4",
		1969 : "0.5",
		1970 : "0.9",
		1971 : "1.7",
		1972 : "0.5",
		1973 : "0.7",
		1974 : "1.2",
		1975 : "0.8",
		1976 : "0.8",
		1977 : "0.6",
		1978 : "1.9",
		1979 : "0.6",
		1980 : "0.8",
		1981 : "1.6",
		1982 : "1",
		1983 : "0.7",
		1984 : "1.2",
		1985 : "0.9",
		1986 : "0.6",
		1987 : "0.7",
		1988 : "1.2",
		1989 : "0.5",
		1990 : "0.9",
		1991 : "0.8",
		1992 : "0.7",
		1993 : "0.8",
		1994 : "1.5",
		1995 : "0.9",
		1996 : "1.6",
		1997 : "0.8",
		1998 : "0.8",
		1999 : "1.9",
		2000 : "1.2" 
	},
	months: {
		1 : "0.6",
		2 : "0.7",
		3 : "1.8",
		4 : "0.9",
		5 : "0.5",
		6 : "1.6",
		7 : "0.9",
		8 : "1.5",
		9 : "1.8",
		10 : "0.8",
		11 : "0.9",
		12 : "0.5"
	},
	days: {
		1 : "0.5",
		2 : "1",
		3 : "0.8",
		4 : "1.5",
		5 : "1.6",
		6 : "1.5",
		7 : "0.8",
		8 : "1.6",
		9 : "0.8",
		10 : "1.6",
		11 : "0.9",
		12 : "1.7", 
		13 : "0.8",
		14 : "1.7",
		15 : "1",
		16 : "0.8",
		17 : "0.9",
		18 : "1.8",
		19 : "0.5",
		20 : "1.5",
		21 : "1",
		22 : "0.9",
		23 : "0.8",
		24 : "0.9",
		25 : "1.5",
		26 : "1.8",
		27 : "0.7",
		28 : "0.8",
		29 : "1.6",
		30 : "0.6"
	},
	hours: {
		"子": "1.6",
		"丑": "0.6",
		"寅": "0.7",
		"卯": "1",
		"辰": "0.9",
		"巳": "1.6",
		"午": "1",
		"未": "0.8",
		"申": "0.8",
		"酉": "0.9",
		"戌": "0.6",
		"亥": "0.6"
	},
	result: {
		21 : "短命非业谓大凶，平生灾难事重重，凶祸频临限逆境，终世困苦事不成",
		22 : "身寒骨冷苦伶仃，此命推来行乞人，劳劳碌碌无度日，中年打拱过平生",
		23 : "此命推来骨轻轻，求谋做事事难成，妻儿兄弟应难许，别处他乡作散（善）人",
		24 : "此命推来福禄无，门庭困苦总难荣，六亲骨肉皆无靠，流到他乡作老人",
		25 : "此命推来祖业微，门庭营度似希奇，六亲骨肉如水炭，一世勤劳自把持",
		26 : "平生衣禄苦中求，独自营谋事不休，离祖出门宜早计，晚来衣禄自无忧</p><p>注解：此命为人刚强，劳心劳力，移祖居住，有能自力得安然，知轻识重，坏事不做，老来贪心口无毒，但一生不足，子息难靠。初限之中小发达，早年家计得安康，四十八九岁，交来末运渐渐谋事而成，事业而就，财源茂盛，老来荣华。妻宫有克，两妻无刑，子息四个只一子送终，寿元七十九，过此七十九岁，死于十二月中。",
		27 : "一生做事少商量，难靠祖宗作主张，独马单枪空作去，早年晚岁总无长</p><p>注解：此命为人性纯不刚不柔，心中无毒，做事有始有终，池塘鸳鸯寻食吃，易聚易散，骨肉六亲不得力，财物风云，操心劳力，极早恨奋寒窗，原来破尽，重新白手起家，且过三十五六，方可成家立业，四十外行船顺风，五十安稳，末限滔滔事业兴，妻宫硬配，子女送终，寿元七十，死于五月中。",
		28 : "一生作事似飘蓬，祖宗产业在梦中，若不过房并改姓，也当移徒二三通</p><p>注解：此命为人多才能，心机灵巧，祖业飘零，离乡别井可成事业，兄弟多力，驳杂多端，为静处安然，出外有人敬重，可进四方之财，有贵人扶持，逢凶化吉，勤俭一生，无大难，只是救人无功，恩中招怨，重义轻才，易聚易散，早年不能聚财，三十三岁方知劳苦，凡事顺意，三十八九，四十岁称心如意，末限福如东海，寿比南山。只是妻宫有克，三子送终，寿元六十九，闯过八十一，死于三月中。",
		29 : "初年运限未曾亨，纵有功名在后成，须过四旬方可上，移居改姓使为良</p><p>注解：此命为人性爆，心直口快，有才能，见善不欺，逢恶不怕，事有始终，量能宽大，但不能聚财，兄弟六亲无力，自立家计，出外方好，初限二十三四五不遂，二十七八有好运到，犹如枯木逢春，中限四十九之命有险，四十多来古镜重磨，明月再圆。五十六七八九末限明月又被云侵，交七十方走大运，妻小配怕刑，克子，寿元七十七，死于春光中。",
		30 : "劳劳碌碌苦中求，东走西奔何日休，若能终身勤与俭，老来稍可免忧愁</p><p>注解：此命为人多才多能，心机为巧，祖业凋零，离乡别井可成家业，兄弟少力，驳杂多端，出外有贵人扶持，一生无刑克，无大难，只是救人无功，恩中招怨，重义轻才，易聚易散，早年不能聚财，三十三岁方知劳苦，凡事顺意，三十八九，四十岁称心如意，三子送终，寿元六十九，死于三月中。",
		31 : "忙忙碌碌苦中求，何日云开见日头，难得祖基家可立，中年衣食渐无忧</p><p>注解：此命推来敬重双亲，有福有禄，六亲和睦，义气高强，少年勤学有功名，忠孝双 全，心中无毒，不贵则福，出外受人钦佩，四海闻名，老来荣华，限上无忧，一生安康 ，年轻欠利，末限安享福禄，白鹤先生云：此命三限，有子孙旺相局，初限早成家计， 辛勤劳苦，中限渐渐生财重奔江山，夫妻少配无刑，末限荣华富贵，寿元八十三岁，死 于冬月之中。",
		32 : "初年运错事难谋，渐有财源如水流，到的中年衣食旺，那时名利一齐来</p><p>注解：中限交来渐渐称心，求谋顺利，出外有人恭敬，一生受贵，若要问其消息，事业 兴，家业旺，其年运到滔滔财源至，滚滚利丰盈，春光花自发，微风细雨生，四十六七 八交末运，移花接子桂花香，夫妻偕老，寿元八十之外，子孙福禄荣昌，死于腊月中。",
		33 : "早年做事事难成，百计徒劳枉费心，半世自如流水去，后来运到始得金</p><p>注解：此命生人性巧心灵，弄假成真，口快无心，恩中招怨，君子敬佩，小人气恨，骨肉无援，志在四方，身心健康，前运乘阴少种树，中限轻财，大运交来，声名可望，万事更新，名利振建，此后小事宜注意，才有子息，寿元八十三，死于三月中。",
		34 : "此命福气果如何，僧道门中衣禄多，离祖出家方得妙，终朝拜佛念弥陀</p><p>注解：此命推来为人性躁，与人做事反为不美，离祖成家，三番四次自成自立安享福，直自三十六至四十六，财不谋而自至，福不求而自得，有贵人助，家庭安宁，妻宫若要无刑，猴、猪、羊、蛇不可配，龙、虎、马、牛方得安，虽有二子，终生带暗方可。兄弟六亲如冰碳，在家不得安然，初限驳杂多端，劳碌奔波不能聚钱，常有忧愁，寿元七十八岁，死于三月中。",
		35 : "生平福量不周全，祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前</p><p>注解：此命为人品性纯和，做事忠直，志气高傲，与人做事恩中招怨，六亲兄弟不得力，祖业全无，早年驳杂多端，独马单枪，初限命运甚来，二十八九三十来岁末曾交运都说好，三十五六到四十犹如金秋菊迎秋放，心机用尽方逢春，末限交来始称怀，祖业有破后重兴，犹如枯木逢春再开花，妻宫忧虚无刑，寿元五十七，限至六十九，三子送终，寿元八十一，死于十月中。",
		36 : "不须劳碌过平生，独自成家福不轻，早有福星常照命，任君行去百般成</p><p>注解：此命为人品性刚直，做事公开有才能，不肯休息，六亲兄弟不得力，祖业无靠，白手成家立业，末运多驳杂，不能聚财，好一双抓钱手，没有一个赚钱斗，此命蜘蛛结网，朝圆夜不圆，做几番败几番，只能稳步成家计，谁知又被狂风吹，初限二十三四，犹如明月被云侵，三十外来恰是日头又重开，终交末运方为贵，渐渐荣昌盛。 二子送终，寿元五十七岁，过此八十八，死于秋天中.",
		37 : "此命般般事不成，弟兄少力自孤成，虽然祖业须微有，来的明时去的暗</p><p>注解：此命为人品性刚直，做事公开有才能，不肯休息，六亲兄弟不得力，祖业无靠，白手成家立业，末运多驳杂，不能聚财，不欺负人，有义气，心神不定，易成喜怒，初限奔波劳苦，离别他境可成家计，改换门庭，中限未得如意，末限环环妻宫，方可刑克，子息虽有不得力，只好真假送终，寿元七十七，死于七月中。",
		38 : "一生骨肉最清高，早入学门姓名标，待看年将三十六，蓝衣脱去换红袍</p><p>注解：此命为人品性刚直，做事公开有才能，不肯休息，六亲兄弟不得力，祖业无靠，白手成家立业，末运多驳杂，不能聚财，好一双抓钱手，没有一个赚钱斗，此命蜘蛛结网，朝圆夜不圆，做几番败几番，只能稳步成家计，谁知又被狂风吹，初限二十三四，犹如明月被云侵，三十外来恰是日头又重开，终交末运方为贵，渐渐荣昌盛。",
		39 : "此命少年运不通，劳劳做事尽皆空，苦心竭力成家计，到得那时在梦中</p><p>注解：此命为人灵机性巧，胸襟通达，志气高，少年勤学有功名之格，青年欠利，腹中多谋，有礼有义，有才能，做事勤俭，一生福禄无，与人干事，反为不美，六亲骨肉可靠，交朋友，四海春风，中限光耀门庭，见善不欺逢恶不怕，事有始终，量能宽大，义济分明，吉人天相，四海闻名，末限成家立业，安然到老，高楼大厦，妻宫两硬无刑，子息三人，只一子送终，寿元七十七，卒于风光中",
		40 : "平生衣禄是绵长，件件心中自主张，前面风霜都受过，从来必定享安泰</p><p>注解：此命为人性躁，心直口快，有才能，逢善不欺，逢恶不怕，事有始终，量能宽大，不能聚财，祖业破败，兄弟六亲不得力，自立家计出外方好，初限二十五六连年不遂，二十七八九有好运，犹如枯木逢春，中限四十九岁有灾，铁镜重磨，明月正圆，五十六七交大运，寿元七十七，卒于春光中。",
		41 : "此命推来事不同，为人能干异凡庸，中年还有逍遥福，不比前年云未通</p><p>注解：此命性重气高，有口无心，祖业未交，离别他境，事事可成，六亲骨肉不得力，自成家计，学习经营，四方闻名，当把外方之时，丰隆初限奔波驳杂，不能聚财，交过三十八九方可成家，四十五六方能顺意，末限犹如三月杨柳，枝枝生细叶，晚景处处红 ，妻宫无克破，子息假送老，寿元六十七，闯过可到八十六，卒于九月中。",
		42 : "得宽怀处且宽怀，何用双眉总不开，若使中年命运济，那时名利一齐来</p><p>注解：此命为人操劳，自成自立，与人出力事不成，离祖之命，成家三番四次，用尽心机不得开怀，若要安乐享福，要到三十六到四十六时不谋自待，福不求自至，有贵人助力，家庭安然，妻宫若要无刑，猴、猪、羊、蛇不可配，龙、虎、马、牛方得安，兄弟六亲如冰碳，在家不得安然，初限驳杂多端，不能聚钱，常有忧愁，寿元七十八岁，死于三月中。",
		43 : "为人心性最聪明，做事轩昂近贵人，衣禄一生天数定，不须劳碌是丰亨</p><p>注解：此命为人性躁刚强，平生不受亏，多技多能，祖业冰碳，能聚财，交过三十开外，方得开怀，中限之命能进四方之财，出外逢贵人之力，艺术精，善经营，方能兴旺，上业迟，有一疾相侵，直至末限方得享福，妻宫匹配，龙虎马牛可配，二子送终，寿元八十，卒于四月之中。",
		44 : "来事由天莫苦求，须知福禄胜前途，当年财帛难如意，晚景欣然便不忧</p><p>注解：此命为人忠直敬重，心慈性躁，深谋远虑，心中多劳，贵人钦敬，六亲冰碳，初限行运，美中不足，中限渐入佳境，名利可佳，刚柔有济，二十九交佳运，可通花甲，天赐麒麟送老，寿元八十五岁，卒于冬月之中。",
		45 : "福中取贵格求真，明敏才华志自伸，福禄寿全家道吉，桂兰毓秀晚荣臻</p><p>注解：此命为人品性不刚不柔，心中无毒，自当自担，离祖之命，做事有始有终，池塘鸳鸯觅食，或聚或散，骨肉六亲不得力，如嗥如风，劳心费力多成败，初限运寒多驳杂，祖业破败，重新白手成家，至三十五六方能成家立业，四十开外，如船遇顺风，五十多岁安稳，末限滔滔事业兴，妻宫硬配，子息伴架送终，寿元七十五岁，卒于五月之中。",
		46 : "东西南北尽皆通，出姓移名更觉隆，衣禄无亏天数定，中年晚景一般同</p><p>注解：此命为人心慈性躁，有口无心，有粗有细，一生奔波，六亲无靠，无大难，妻宫无刑，祖业凋零，自立家计，早业如同败落萍，劳心用下一半生，交三十五六七八九岁，又平平度过几春秋，六十前后花开日，花开又招雨来淋，必定小人加暗害，平日之中要小心，早子招维，只一子送终，寿元七十三，卒于冬月之中",
		47 : "此命推来旺末年，妻荣子贵自怡然，平生原有滔滔福，可有财源如水流</p><p>注解：此命为人品性纯和，做事公道，忠心待人气质高，与人干事恩仇报，兄弟不力祖业微，早年驳杂多端，时来骨肉精，财源是归命，匹马单枪，初限运来二十八九三十岁，末限交运都好，反到交时苦衰，三十六至四十来岁，犹如金秋菊遇秋开放，心机用尽方为贵，末运交来怡称怀，祖业有破，家业重注，好似枯木逢春再开花，孤子送老，五十九岁有一限到六十九岁，寿元八十二卒于冬月之中。",
		48 : "幼年运道未曾享，苦是蹉跎再不兴，兄弟六亲皆无靠，一身事业晚年成</p><p>注解：此命为人性躁，能随机应变，常近贵人，祖业无成，骨肉六亲少义，一个自立家计，初限交来财运如霜雪，中限略可成家，大运突来能立家业，妻有克，小配无刑，子息三人，寿元七十七岁，卒于七月之中。",
		49 : "此命推来福不轻，自立自成显门庭，从来富贵人亲近，使婢差奴过一生</p><p>注解：此命为人品性纯和，做事勤俭，恩中招怨，兄弟有克，亲朋相援，赔酒赔饭，反说不美，初限贫愁，交过二十六七岁，如逆水行舟，不能聚财，中限驳杂多端，刑妻克子，交过四十岁，方可成家立业，般般遂意，件件称心，至四十七八岁有一灾，宁可损财交过，后有十年好运来，家中钱财聚，三子送老，寿元七十三岁，卒于九月之中。",
		50 : "为利为名终日劳，中年福禄也多遭，老来是有财星照，不比前番目下高</p><p>注解：此命为人正直，伶俐灵巧，有机变，平生无大难，祖业无靠，自成自立，白手成家，亲朋冷落，兄弟少力，可得四方之财，好一双挣钱手，没有一个聚钱斗，满面春风人道好，一生不足自爱知，妻迟子晚，初限奔波，中限四十岁方交大运，犹如枯木逢春，四十九岁有一灾，其年福星高照，有十年大运，财禄丰盈大吉昌，妻宫铁硬同偕老，子息一双可送终，寿元六十九岁，卒于冬月之中。",
		51 : "一世荣华事事通，不须劳碌自亨通，兄弟叔侄皆如意，家业成时福禄宏</p><p>注解：此命为人做事有能力，且能随机应变，性燥能知其轻重，交朋结友如兄弟，气量宽宏，见善不欺，逢恶不怕，平生正直，无大难刑险，只是少招祖业，初限衣禄无亏，子息晚招可实得，四十至五十，末限通达昌吉，福禄无亏，财源稳定，丰衣足食，高堂大厦，妻宫友好，二子两女送终，寿元八十岁，卒于九月中。",
		52 : "一世亨通事事能，不须劳思自然能，宗施欣然心皆好，家业丰亨自称心</p><p>注解：此命为人多才多能，心机灵变，祖业飘零，离乡可成家计，兄弟少力，驳杂多端，为人只是救人无功，重义轻财，财禄易聚易散，早年聚财凡事顺意，三十八九四十岁如意称心，末限福如东海，寿比南山，只是妻克两硬无刑，有三子二女送终，寿元八十三，卒于冬月之中。",
		53 : "此格推来气象真，兴家发达在其中，一生福禄安排定，却是人间一富翁</p><p>注解：此命推来敬重双亲，有福有禄，气质高昂，少年勤学有功名，忠孝两全，心善无毒，非富则贵，出外有人钦佩，四海名扬，到老荣华，限上无忧，一世健康，青年欠利，末限安享福禄，白鹤先生云：此骨三限之骨，子孙王相之局，初限早成家计，辛勤劳苦，中限渐渐生财，重整门庭，末限荣华富贵，妻宫小配无刑，有三子二女送终，寿元八十二，卒于冬月之中。",
		54 : "此命推来厚且清，诗书满腹看功成，丰衣足食自然稳，正是人间有福人</p><p>注解：此命为人灵巧，胸襟通达，志气高强，少年勤学有功名，年轻欠利，腹中多谋，有礼有义，有才有能，做事勤俭，一生福禄无亏，与人干事反为不美，亲朋戚友，四海春风。中限光辉门庭，逢善不欺，逢恶不怕，事有始终，吉人天相，四海扬名，成家立业，安然到老，高楼大厦，妻宫硬无刑，子息三人，只一子送终，寿元七十七，卒于春光中。",
		55 : "走马扬鞭争名利，少年做事废筹论，一朝福禄源源至，富贵荣华显六亲</p><p>注解：此命为人灵巧机巧，初限尚不聚财，只是虚名虚利，财来财去，一生勤于学，自有功名，有衣禄，福星照命，中限交来可称心，求谋如意，出外有人恭敬，一生受贵，要问其他消息，事后兴家发达，壮年滔滔财源旺，滚滚利顺来，迎春花正发，微风细雨生，四十九交来末运，移花接木桂花香，夫妻百年同偕老，寿元八十之外，福禄荣昌，卒于春光之中。",
		56 : "此格推来礼仪通，一生福禄用无穷，甜酸苦辣皆尝过，财源滚滚稳且丰</p><p>注解：此命为人性巧心灵，有口无心，事不保密，少年劳碌难免，志在四方，身心健康，前运乘阴少种树，怀才不遇，中限轻财，大举随行，移动得安然终日成，名声可望，旧业换新，名利亨通，五人盆石皆白发，倾自心田此后昆，此命小事宜放松，方有子息，寿元八十二岁，卒于冬月之中。",
		57 : "福禄盈盈万事全，一生荣耀显双亲，名扬威震人钦敬，处世逍遥似遇春</p><p>注解：此命为人心灵性巧，做事细致，足智多谋，志气高昂，少年勤学，名利成就，逍遥快乐，气量宽宏，财禄有余，犹如锦上添花，中限以来，自成自立，渐渐荣昌，招人进财，妻子晚配为美，四十至四十五六岁，看子成名，末限多得意，家中财产甚丰隆，妻宫无克，二子送终，寿元七十三岁，卒于正月中。",
		58 : "平生福禄自然来，名利兼全福禄偕，雁塔提名为贵客，紫袍金带走金鞋</p><p>注解：此命为人忠直，做事有头有尾，身清气高，六亲有旺，兄弟少帮，妻宫并重，子息二三，他乡创业，官臣之命，只是与人干事，恩中招怨，反为不美，早限财来财去，中限兴旺，一子送终，寿元八十三岁，卒于四月之中。",
		59 : "细推此格妙且清，必定才高礼仪通，甲第之中应有分，扬鞭走马显威荣</p><p>注解：此命为人性情暴躁，刚强，平生不受亏，所谓量大多智多能，受人尊敬，祖业凋零，兄弟只可画饼冲饥，亲戚则是望梅止渴，劳心见早，发福见迟，独立成家，只是早聚财，逢凶化吉，驳杂交过二十开外，方得顺利开怀，中限之命可进四方之财，出外有贵人助力，可精手艺营业，方能兴家立业，此间或有小疾相侵，再交限方得安然，坐享福禄，妻宫之配龙虎马牛，一子送老，寿元八十岁，卒于六月之中。",
		60 : "一朝金榜快提名，显祖荣宗立大功，衣食定然原欲足，田园财帛更丰盈</p><p>注解：此命为人灵机性巧，胸襟发达，志气高强，少年勤学，有功名之格，青年欠利，腹中多谋，有礼有仪，有才能，做事勤俭，一生福禄无亏，与人做事，有力无功，兄弟骨肉中多谋，交朋友，四海名扬，中限光辉门户，早能发达，义利分明，末限成家立业安然到老，高楼大厦，妻宫两硬无刑，子息三人，只有一人送终，寿元七十七岁，卒于春光之中。",
		61 : "不做朝中金榜客，定为世上一财翁，聪明天赋经书熟，名显高克自是荣</p><p>注解：此命为人心秉直，聪明利达，心善口快，有才能。见善不欺，逢恶不怕，刚柔有济，事有始终，早能宽大，而能聚财，祖业如旧，六亲兄弟有靠，自立家计出外更好，二十至二十五六七八九岁有险，三十开外古镜重磨，明月再圆，六十六至七十方交大运妻宫小配，寿元七十七岁，卒于春光之中。",
		62 : "此名生来福不穷，读书必定显亲荣，紫衣金带为卿相，富贵荣华皆可同</p><p>注解：此命为人忠直敦厚，心无所毒，性巧灵敏，深谋远虑，吉人天相，心中多劳，受人钦叹，美中不足，中限渐入佳境，名利可佳，刚济有情，二十九交来阳春暖，东北佳音，天津四通，花甲一二岁大顺，天赐麒麟送老，寿元八十五岁，卒于冬月之中。",
		63 : "命主为官福禄长，得来富贵定非常，名题金塔传金榜，定中高科天下扬</p><p>注解：此命为人聪明利达，近知识，远小人，自觉性强，改悔及时，君子量大，福禄寿三星拱照，富贵名扬天下，荣宗显祖之格，可是美中欠佳，妻宫有硬，操劳心重，先天下之忧而忧，后天下之乐而乐，寿元七十有八，享于荣绵归期，二子二女送终。",
		64 : "此格权威不可当，紫袍金带坐高堂，荣华富贵谁能及，积玉堆金满储仓",
		65 : "细推此命福不轻，安国安邦极品人，文绣雕梁政富贵，威声照耀四方闻",
		66 : "此格人间一福人，堆金积玉满堂春，从来富贵由天定，正笏垂绅谒圣君",
		67 : "此名生来福自宏，田园家业最高隆，平生衣禄丰盈足，一世荣华万事通",
		68 : "富贵由天莫苦求，万金家计不须谋，十年不比前番事，祖业根基水上舟",
		69 : "君是人间衣禄星，一生福贵众人钦，纵然福禄由天定，安享荣华过一生",
		70 : "此命推来福不轻，不须愁虑苦劳心，一生天定衣与禄，富贵荣华过一生",
		71 : "此名生来大不同，公侯卿相在其中，一生自有逍遥福，富贵荣华极品隆",
		72 : "此格世界罕有生，十代积善产此人，天上紫微来照命，统治万民乐太平"
	},
	arrHours : [{
		text : '23：00--1：00',
		value : "子"
	}, {
		text : '1：00--3：00',
		value : "丑"
	}, {
		text : '3：00--5：00',
		value : "寅"
	}, {
		text : '5：00--7：00',
		value : "卯"
	}, {
		text : '7：00--9：00',
		value : "辰"
	}, {
		text : '9：00--11：00',
		value : "巳"
	}, {
		text : '11：00--13：00',
		value : "午"
	}, {
		text : '13：00--15：00',
		value : "未"
	}, {
		text : '15：00--17：00',
		value : "申"
	}, {
		text : '17：00--19：00',
		value : "酉"
	}, {
		text : '19：00--21：00',
		value : "戌"
	}, {
		text : '21：00--23：00',
		value : "亥"
	}]
};

var App = {	
	birth: {},
	nongli: {},
	init: function(){
		for( var i = 1960; i <= 2000; i ++){
			var oOption = document.createElement("OPTION");
			oOption.text = i;
			oOption.value = i;
			$('year').add(oOption);
		}
		for( var i = 1; i <= 12; i ++){
			var oOption = document.createElement("OPTION");
			oOption.text = i;
			oOption.value = i;
			$('month').add(oOption);
		}
		for( var i = 1; i <= 31; i ++){
			var oOption = document.createElement("OPTION");
			oOption.text = i;
			oOption.value = i;
			$('day').add(oOption);
		}
		for( var i = 0, l = data.arrHours.length; i < l; i ++){
			var oOption = document.createElement("OPTION");
			oOption.text = data.arrHours[i].text;
			oOption.value = data.arrHours[i].value;
			$('hour').add(oOption);
		}
		$('year').value = '1984';
		$('month').value = '12';
		$('day').value = '30';
		$('hour').value = '午';

		var self = this;
		$('c').onclick = function(){
			self.birth = {
					year: $('year').options[$('year').selectedIndex].text,
					month: $('month').options[$('month').selectedIndex].text,
					day: $('day').options[$('day').selectedIndex].text,
					hour: $('hour').options[$('hour').selectedIndex].value
				};
			self.run();
		};
	},
	run: function(){
		if($('type').value == 'a'){
			this.tran();			
		} else {
			this.nongli = this.birth;
		}
		var y = parseFloat(data.years[this.nongli.year])*10;
		var m = parseFloat(data.months[this.nongli.month])*10;
		var d = parseFloat(data.days[this.nongli.day])*10;
		var h = parseFloat(data.hours[this.birth.hour])*10;
		
		var re = y + m + d + h;
		var a = Math.floor(re / 10), b = re % 10;
		
		if(re > 72 || re < 21){
			$('result').innerHTML = re;
		} else {
			$('result').innerHTML = '<p>农历：' + this.nongli.year + '年' + this.nongli.month + '月' + this.nongli.day + '日' + this.birth.hour + '时</p><p>重：' + a + '两' + b + '钱</p><p>' + data.result[re] + '</p>';
		}
	},
	tran: function(){
		var wNongliData = new Array(
			2635,333387,1701,1748,267701,694,2391,133423,1175,396438,
			3402,3749,331177,1453,694,201326,2350,465197,3221,3402,
			400202,2901,1386,267611,605,2349,137515,2709,464533,1738,
			2901,330421,1242,2651,199255,1323,529706,3733,1706,398762,
			2741,1206,267438,2647,1318,204070,3477,461653,1386,2413,
			330077,1197,2637,268877,3365,531109,2900,2922,398042,2395,
			1179,267415,2635,661067,1701,1748,398772,2742,2391,330031,
			1175,1611,200010,3749,527717,1452,2742,332397,2350,3222,
			268949,3402,3493,133973,1386,464219,605,2349,334123,2709,
			2890,267946,2773,592565,1210,2651,395863,1323,2707,265877);
		
		var wMonthAdd = [0,31,59,90,120,151,181,212,243,273,304,334];
		
		var solarMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
		
		var Gan = new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
		var Zhi = new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
		var Animals = new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
		
		var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至")
		
		var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758)
		
		var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十')
		var nStr2 = new Array('初','十','廿','卅','　')
		var monthName = new Array("*","正","二","三","四","五","六","七","八","九","十","冬","腊");
		
		
		var yy = parseInt(this.birth.year, 10);
		var mm = parseInt(this.birth.month, 10);
		var dd = parseInt(this.birth.day, 10);
		
		var nTheDate = (yy - 1921) * 365 + Math.floor((yy - 1921) / 4) + dd + wMonthAdd[mm - 1] - 38;		
		if((!(yy % 4)) && (mm > 2)){
			nTheDate = nTheDate + 1;
		}
		nTheDate = parseInt(nTheDate, 10);
		
		var nIsEnd = 0;
		var m = 0, k, n;
		while(nIsEnd != 1){
			if(wNongliData[m] < 4095)
				k = 11;
			else
				k = 12;
			n = k;
			while(n>=0){
				//获取wNongliData(m)的第n个二进制位的值
				var nBit = wNongliData[m];
				for(i = 1; i < n + 1; i ++)
					nBit = Math.floor(nBit/2);
				
				nBit = Math.floor(nBit % 2);
				
				if (nTheDate <= (29 + nBit)){
					nIsEnd = 1;
					break;
				}
				
				nTheDate = nTheDate - 29 - nBit;
				n = n - 1;
			}
			if(nIsEnd)
				break;
			m = m + 1;
		}
		yy = 1921 + m;
		mm = k - n + 1;
		dd = nTheDate;
		if (k == 12){
			if (mm == wNongliData[m] / 65536 + 1)
				mm = 1 - mm;
			else if (mm > wNongliData[m] / 65536 + 1)
				mm = mm - 1;
		}
		this.nongli = {year: yy, month: mm, day: dd, hour: this.birth.hour};
	}
};

window.onload = function(){
	App.init();
}
