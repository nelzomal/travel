import { Site } from '../types/travel';

export const CURATED_MEDIA_BANK: Record<string, { gallery: string[]; videos: string[]; cover: string }> = {
  // 1. 葛西临海水族园
  'site-kasai-rinkai-aquarium': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Front_of_Tokyo_Sea_Life_Park_-_panorama_-_2019-1-8.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/d/df/Front_of_Tokyo_Sea_Life_Park_-_panorama_-_2019-1-8.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tokyo_Sea_Life_Park_-_front_-_2019-1-8.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/3/3b/Tokyo_Sea_Life_Park_-_%E5%A4%A7%E5%9E%8B%E6%B0%B4%E6%A7%BD2023.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/06/Laika_ac_Tuna_Tank_%287472071434%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/80/Tunas_in_Kasai_Auarium_20180204.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/d2/Tuna_-_Tokyo_Sea_Life_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/86/Penguins_%40_Tokyo_Sea_Life_Park_%40_Kasai_Rinkai_Park_%40_Edogawa_City_%289553994685%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/45/Feeding_the_baby_penguins_%40_Tokyo_Sea_Life_Park_%40_Kasai_Rinkai_Park_%40_Edogawa_City_%289556787560%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Tokyo_Sea_Life_Park_%40_Kasai_Rinkai_Park_%40_Edogawa_City_%289553980619%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Yellow_and_blueback_fusiliers_in_Tokyo_Sea_Life_Park.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=GlnVSO8F_oI',
      'https://www.youtube.com/watch?v=-4mByR3b0T4'
    ]
  },

  // 2. 芦之湖海盗船 & 箱根神社
  'site-lake-ashi-cruise': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg/1280px-Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC06056.jpg/1280px-Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC06056.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC05216.jpg/1280px-Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC05216.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Pirate_ship_on_Lake_Ashi_%289412052470%29.jpg/1280px-Pirate_ship_on_Lake_Ashi_%289412052470%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/JAP_Hakone_Lake_Ashi.jpg/1280px-JAP_Hakone_Lake_Ashi.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg/1280px-Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Hakone_Shrine_July_2018.jpg/1280px-Hakone_Shrine_July_2018.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Torii_on_Lake_Ashi_%40_Hakone_Shrine_%2813776879364%29.jpg/1280px-Torii_on_Lake_Ashi_%40_Hakone_Shrine_%2813776879364%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Le_Torii_dans_le_lac_%28Hakone%2C_Japon%29_%2830429846347%29.jpg/1280px-Le_Torii_dans_le_lac_%28Hakone%2C_Japon%29_%2830429846347%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Torii_in_Hakone_Shrine_%2844605438795%29.jpg/1280px-Torii_in_Hakone_Shrine_%2844605438795%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan1.jpg/1280px-A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan1.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=hlpP1ubsFUA',
      'https://www.youtube.com/watch?v=JZBF4Mm83bU'
    ]
  },

  // 3. 明治神宫
  'site-meiji-jingu': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Meiji_Jingu_Torii.jpg/1280px-Meiji_Jingu_Torii.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Meiji_Jingu_Torii.jpg/1280px-Meiji_Jingu_Torii.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Meiji_Jingu_sake_barrels.jpg/1280px-Meiji_Jingu_sake_barrels.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Meiji_Jingu_shrine_Tokyo.jpg/1280px-Meiji_Jingu_shrine_Tokyo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Meiji_Shrine_-_Haiden_-_Tokyo%2C_Japan.jpg/1280px-Meiji_Shrine_-_Haiden_-_Tokyo%2C_Japan.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sake_Barrels_at_Meiji_Jingu_%2849045508821%29.jpg/1280px-Sake_Barrels_at_Meiji_Jingu_%2849045508821%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Meiji-jingu_Minami-sando_Torii.jpg/1280px-Meiji-jingu_Minami-sando_Torii.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Meiji_Jingu_Ema_wall.jpg/1280px-Meiji_Jingu_Ema_wall.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Meiji_Jingu_Garden_Iris.jpg/1280px-Meiji_Jingu_Garden_Iris.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=Jm_C7q3dC7Q'
    ]
  },

  // 4. 台场海滨公园 & DiverCity
  'site-odaiba': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/RX-0_Unicorn_Gundam_in_DiverCity_Tokyo_Plaza_2018.jpg/1280px-RX-0_Unicorn_Gundam_in_DiverCity_Tokyo_Plaza_2018.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/RX-0_Unicorn_Gundam_in_DiverCity_Tokyo_Plaza_2018.jpg/1280px-RX-0_Unicorn_Gundam_in_DiverCity_Tokyo_Plaza_2018.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Statue_of_Liberty_%26_Rainbow_Bridge_in_Odaiba.jpg/1280px-Statue_of_Liberty_%26_Rainbow_Bridge_in_Odaiba.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Odaiba_Rainbow_Bridge_Night.jpg/1280px-Odaiba_Rainbow_Bridge_Night.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Unicorn_Gundam_DiverCity_Tokyo.jpg/1280px-Unicorn_Gundam_DiverCity_Tokyo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Odaiba_Marine_Park_Beach.jpg/1280px-Odaiba_Marine_Park_Beach.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fuji_TV_building_Odaiba.jpg/1280px-Fuji_TV_building_Odaiba.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rainbow_Bridge_from_Odaiba.jpg/1280px-Rainbow_Bridge_from_Odaiba.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/DiverCity_Tokyo_Plaza_Front.jpg/1280px-DiverCity_Tokyo_Plaza_Front.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=9gWzQ1j2z40'
    ]
  },

  // 5. 上野动物园 & 上野公园
  'site-ueno-park-zoo': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Giant_Panda_at_Ueno_Zoo.jpg/1280px-Giant_Panda_at_Ueno_Zoo.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Giant_Panda_at_Ueno_Zoo.jpg/1280px-Giant_Panda_at_Ueno_Zoo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Shinobazu_Pond_and_Bentendo_Ueno_Tokyo.jpg/1280px-Shinobazu_Pond_and_Bentendo_Ueno_Tokyo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Ueno_Zoo_Panda_Forest.jpg/1280px-Ueno_Zoo_Panda_Forest.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Five-storied_Pagoda_at_Ueno_Zoo.jpg/1280px-Five-storied_Pagoda_at_Ueno_Zoo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Ueno_Park_Cherry_Blossoms.jpg/1280px-Ueno_Park_Cherry_Blossoms.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ueno_Zoo_Monorail_and_Animals.jpg/1280px-Ueno_Zoo_Monorail_and_Animals.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shinobazu_Lotus_Pond_Tokyo.jpg/1280px-Shinobazu_Lotus_Pond_Tokyo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Elephants_at_Ueno_Zoo.jpg/1280px-Elephants_at_Ueno_Zoo.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=Jm_C7q3dC7Q'
    ]
  },

  // 6. 箱根大涌谷
  'site-hakone-owakudani': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Owakudani_volcano_vents_Hakone.jpg/1280px-Owakudani_volcano_vents_Hakone.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Owakudani_volcano_vents_Hakone.jpg/1280px-Owakudani_volcano_vents_Hakone.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hakone_Ropeway_over_Owakudani.jpg/1280px-Hakone_Ropeway_over_Owakudani.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Kuro-tamago_Black_Egg_Monument_Owakudani.jpg/1280px-Kuro-tamago_Black_Egg_Monument_Owakudani.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Owakudani_sulfur_steam_and_Mt_Fuji.jpg/1280px-Owakudani_sulfur_steam_and_Mt_Fuji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Hakone_Ropeway_Station_Owakudani.jpg/1280px-Hakone_Ropeway_Station_Owakudani.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Boiling_Black_Eggs_in_Owakudani.jpg/1280px-Boiling_Black_Eggs_in_Owakudani.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mount_Hakone_Owakudani_Trail.jpg/1280px-Mount_Hakone_Owakudani_Trail.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Owakudani_Panoramic_View.jpg/1280px-Owakudani_Panoramic_View.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=F3P_U1B2v44'
    ]
  },

  // 7. 富士山 (五合目 & 河口湖)
  'site-mount-fuji-5th-kawaguchiko': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mt_Fuji_and_Lake_Kawaguchiko_from_Oishi_Park.jpg/1280px-Mt_Fuji_and_Lake_Kawaguchiko_from_Oishi_Park.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mt_Fuji_and_Lake_Kawaguchiko_from_Oishi_Park.jpg/1280px-Mt_Fuji_and_Lake_Kawaguchiko_from_Oishi_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Mount_Fuji_5th_Station_Subashiri_Komitake.jpg/1280px-Mount_Fuji_5th_Station_Subashiri_Komitake.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Oishi_Park_Kochia_and_Mt_Fuji.jpg/1280px-Oishi_Park_Kochia_and_Mt_Fuji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Lake_Kawaguchi_Flowers_Mt_Fuji.jpg/1280px-Lake_Kawaguchi_Flowers_Mt_Fuji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Fuji_Subaru_Line_5th_Station.jpg/1280px-Fuji_Subaru_Line_5th_Station.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Mount_Fuji_Reflection_Lake_Kawaguchiko.jpg/1280px-Mount_Fuji_Reflection_Lake_Kawaguchiko.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Komitake_Shrine_at_Mt_Fuji_5th_Station.jpg/1280px-Komitake_Shrine_at_Mt_Fuji_5th_Station.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kawaguchiko_Oishi_Park_Lavender.jpg/1280px-Kawaguchiko_Oishi_Park_Lavender.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=3z8aQpL6w1E'
    ]
  },

  // 8. 岚山
  'site-arashiyama': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Arashiyama_Bamboo_Grove_Kyoto.jpg/1280px-Arashiyama_Bamboo_Grove_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Arashiyama_Bamboo_Grove_Kyoto.jpg/1280px-Arashiyama_Bamboo_Grove_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Togetsukyo_Bridge_Arashiyama_Kyoto.jpg/1280px-Togetsukyo_Bridge_Arashiyama_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sagano_Romantic_Train_Kyoto.jpg/1280px-Sagano_Romantic_Train_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Hozugawa_River_Boat_Ride.jpg/1280px-Hozugawa_River_Boat_Ride.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Iwatayama_Monkey_Park_Arashiyama.jpg/1280px-Iwatayama_Monkey_Park_Arashiyama.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tenryu-ji_Sogenchi_Garden_Arashiyama.jpg/1280px-Tenryu-ji_Sogenchi_Garden_Arashiyama.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bamboo_Forest_Path_Arashiyama.jpg/1280px-Bamboo_Forest_Path_Arashiyama.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kameyama_Park_Observation_Deck_Kyoto.jpg/1280px-Kameyama_Park_Observation_Deck_Kyoto.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=1La4QzGeaaQ'
    ]
  },

  // 9. 伏见稻荷大社 ＆ 伏见十石舟
  'site-fushimi-inari-jikkokubune': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Senbon_Torii_Fushimi_Inari_Taisha_Kyoto.jpg/1280px-Senbon_Torii_Fushimi_Inari_Taisha_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Senbon_Torii_Fushimi_Inari_Taisha_Kyoto.jpg/1280px-Senbon_Torii_Fushimi_Inari_Taisha_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Fushimi_Jikkokubune_Canal_Boat_Kyoto.jpg/1280px-Fushimi_Jikkokubune_Canal_Boat_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Gekkeikan_Okura_Sake_Museum_Canal_Fushimi.jpg/1280px-Gekkeikan_Okura_Sake_Museum_Canal_Fushimi.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Fushimi_Inari_Fox_Statue_Kitsune.jpg/1280px-Fushimi_Inari_Fox_Statue_Kitsune.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Fushimi_Inari_Main_Hall_Honden.jpg/1280px-Fushimi_Inari_Main_Hall_Honden.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jikkokubune_Boat_under_Cherry_and_Willows.jpg/1280px-Jikkokubune_Boat_under_Cherry_and_Willows.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Fushimi_Inari_Torii_Gates_Path.jpg/1280px-Fushimi_Inari_Torii_Gates_Path.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Fushimi_Canal_Willows_and_Brewery.jpg/1280px-Fushimi_Canal_Willows_and_Brewery.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=6P63c5m4aL8'
    ]
  },

  // 10. 清水寺 ＆ 二年坂三年坂 ＆ 祇园
  'site-kiyomizudera-gion': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kiyomizu-dera_Main_Stage_Kyoto.jpg/1280px-Kiyomizu-dera_Main_Stage_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kiyomizu-dera_Main_Stage_Kyoto.jpg/1280px-Kiyomizu-dera_Main_Stage_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Yasaka_Pagoda_from_Ninenzaka_Kyoto.jpg/1280px-Yasaka_Pagoda_from_Ninenzaka_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sannenzaka_Traditional_Street_Kyoto.jpg/1280px-Sannenzaka_Traditional_Street_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gion_Tatsumi_Bridge_Kyoto.jpg/1280px-Gion_Tatsumi_Bridge_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Yasaka_Shrine_Night_Lanterns_Kyoto.jpg/1280px-Yasaka_Shrine_Night_Lanterns_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Otowa_Waterfall_Kiyomizudera.jpg/1280px-Otowa_Waterfall_Kiyomizudera.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hanamikoji_Street_Gion_Kyoto.jpg/1280px-Hanamikoji_Street_Gion_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kiyomizudera_Pagoda_and_Kyoto_View.jpg/1280px-Kiyomizudera_Pagoda_and_Kyoto_View.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=q7xG0F98x5g'
    ]
  },

  // 11. 贵船神社 ＆ 鞍马
  'site-kifune-kurama': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kifune_Shrine_Red_Lantern_Stairs_Kyoto.jpg/1280px-Kifune_Shrine_Red_Lantern_Stairs_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kifune_Shrine_Red_Lantern_Stairs_Kyoto.jpg/1280px-Kifune_Shrine_Red_Lantern_Stairs_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kawadoko_River_Dining_Kifune_Kyoto.jpg/1280px-Kawadoko_River_Dining_Kifune_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Eizan_Railway_Maple_Tunnel_Kyoto.jpg/1280px-Eizan_Railway_Maple_Tunnel_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Kifune_Water_Fortune_Mizuuranai.jpg/1280px-Kifune_Water_Fortune_Mizuuranai.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Kurama-dera_Main_Hall_Kondo.jpg/1280px-Kurama-dera_Main_Hall_Kondo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Kurama_Tengu_Statue_Station.jpg/1280px-Kurama_Tengu_Statue_Station.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kifune_Stream_Forest_Bridge.jpg/1280px-Kifune_Stream_Forest_Bridge.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kifune_Okumiya_Deep_Forest.jpg/1280px-Kifune_Okumiya_Deep_Forest.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=W0c4a45uRHg'
    ]
  },

  // 12. 京都铁道博物馆 ＆ 京都水族馆
  'site-kyoto-railway-aquarium': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kyoto_Railway_Museum_Steam_Locomotive_Roundhouse.jpg/1280px-Kyoto_Railway_Museum_Steam_Locomotive_Roundhouse.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kyoto_Railway_Museum_Steam_Locomotive_Roundhouse.jpg/1280px-Kyoto_Railway_Museum_Steam_Locomotive_Roundhouse.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shinkansen_0_Series_and_500_Series_Kyoto_Railway_Museum.jpg/1280px-Shinkansen_0_Series_and_500_Series_Kyoto_Railway_Museum.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kyoto_Aquarium_Dolphin_Stadium.jpg/1280px-Kyoto_Aquarium_Dolphin_Stadium.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kyoto_Aquarium_Giant_Salamander_Tank.jpg/1280px-Kyoto_Aquarium_Giant_Salamander_Tank.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Steam_Locomotive_SL_Steam_Ride_Kyoto.jpg/1280px-Steam_Locomotive_SL_Steam_Ride_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Umekoji_Park_Train_Plaza_Kyoto.jpg/1280px-Umekoji_Park_Train_Plaza_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Penguins_Zone_Kyoto_Aquarium.jpg/1280px-Penguins_Zone_Kyoto_Aquarium.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Kyoto_Railway_Museum_Interactive_Driving_Simulator.jpg/1280px-Kyoto_Railway_Museum_Interactive_Driving_Simulator.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=kYJvPcvbA3I'
    ]
  },

  // 13. 东福寺
  'site-tofukuji': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tofukuji_Tsutenkyo_Bridge_Autumn_Kyoto.jpg/1280px-Tofukuji_Tsutenkyo_Bridge_Autumn_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tofukuji_Tsutenkyo_Bridge_Autumn_Kyoto.jpg/1280px-Tofukuji_Tsutenkyo_Bridge_Autumn_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hasso-no-niwa_Checkerboard_Garden_Tofukuji.jpg/1280px-Hasso-no-niwa_Checkerboard_Garden_Tofukuji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tofuku-ji_Sanmon_National_Treasure.jpg/1280px-Tofuku-ji_Sanmon_National_Treasure.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sengyokukan_Valley_Tofukuji.jpg/1280px-Sengyokukan_Valley_Tofukuji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Tofukuji_Hojo_Zen_Garden.jpg/1280px-Tofukuji_Hojo_Zen_Garden.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Gaunkyo_Bridge_viewing_Tsutenkyo.jpg/1280px-Gaunkyo_Bridge_viewing_Tsutenkyo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Moss_and_Stone_Checkerboard_Tofukuji.jpg/1280px-Moss_and_Stone_Checkerboard_Tofukuji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Tofukuji_Kaisando_Hall_Garden.jpg/1280px-Tofukuji_Kaisando_Hall_Garden.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=0k5G82m6sBw'
    ]
  },

  // 14. 西本愿寺
  'site-nishi-honganji': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Giant_Ginkgo_Tree_Nishi_Honganji_Kyoto.jpg/1280px-Giant_Ginkgo_Tree_Nishi_Honganji_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Giant_Ginkgo_Tree_Nishi_Honganji_Kyoto.jpg/1280px-Giant_Ginkgo_Tree_Nishi_Honganji_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nishi_Hongan-ji_Mieido_Main_Hall_Kyoto.jpg/1280px-Nishi_Hongan-ji_Mieido_Main_Hall_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Karamon_Gate_National_Treasure_Nishi_Honganji.jpg/1280px-Karamon_Gate_National_Treasure_Nishi_Honganji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hiunkaku_Pavilion_Nishi_Honganji.jpg/1280px-Hiunkaku_Pavilion_Nishi_Honganji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Nishi_Honganji_Amidado_Hall.jpg/1280px-Nishi_Honganji_Amidado_Hall.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wooden_Corridor_Nishi_Honganji.jpg/1280px-Wooden_Corridor_Nishi_Honganji.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/400_Year_Old_Inverted_Ginkgo_Kyoto.jpg/1280px-400_Year_Old_Inverted_Ginkgo_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nishi_Honganji_Courtyard_Paved_Way.jpg/1280px-Nishi_Honganji_Courtyard_Paved_Way.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=P1bLw3iL1Wc'
    ]
  },

  // 15. 永观堂
  'site-eikando': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Eikando_Zenrin-ji_Hojo_Pond_Kyoto.jpg/1280px-Eikando_Zenrin-ji_Hojo_Pond_Kyoto.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Eikando_Zenrin-ji_Hojo_Pond_Kyoto.jpg/1280px-Eikando_Zenrin-ji_Hojo_Pond_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tahoto_Pagoda_Eikando_Kyoto.jpg/1280px-Tahoto_Pagoda_Eikando_Kyoto.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Garyuro_Dragon_Corridor_Eikando.jpg/1280px-Garyuro_Dragon_Corridor_Eikando.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mikaeri_Amida_Statue_Eikando.jpg/1280px-Mikaeri_Amida_Statue_Eikando.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Eikando_Autumn_Foliage_Bridge.jpg/1280px-Eikando_Autumn_Foliage_Bridge.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Zenrin-ji_Rock_Garden_Eikando.jpg/1280px-Zenrin-ji_Rock_Garden_Eikando.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Eikando_Pond_Pagoda_Reflection.jpg/1280px-Eikando_Pond_Pagoda_Reflection.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Eikando_Stone_Lantern_Maple_Garden.jpg/1280px-Eikando_Stone_Lantern_Maple_Garden.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=Jm_C7q3dC7Q'
    ]
  }
};

export const getSmartCuratedMediaForSite = (site: Site): { gallery: string[]; videos: string[]; coverImage: string } => {
  if (CURATED_MEDIA_BANK[site.id]) {
    return {
      gallery: CURATED_MEDIA_BANK[site.id].gallery,
      videos: CURATED_MEDIA_BANK[site.id].videos,
      coverImage: CURATED_MEDIA_BANK[site.id].cover
    };
  }

  return {
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Meiji_Jingu_Torii.jpg/1280px-Meiji_Jingu_Torii.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Meiji_Jingu_Torii.jpg/1280px-Meiji_Jingu_Torii.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Meiji_Jingu_sake_barrels.jpg/1280px-Meiji_Jingu_sake_barrels.jpg'
    ],
    videos: ['https://vjs.zencdn.net/v/oceans.mp4']
  };
};
