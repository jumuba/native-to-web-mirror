import PhoneLayout from "@/components/PhoneLayout";
import cardDadRemembrance from "@/assets/card_dad_remembrance.jpg";
import cardMumRemembrance from "@/assets/card_mum_remembrance.jpg";
import cardTwinsBirth from "@/assets/card_twins_birth.jpg";
import cardWifeBirthday from "@/assets/card_wife_birthday.jpg";
import cardClaraBday from "@/assets/card_clara_bday.jpg";
import cardTomMarriage from "@/assets/card_tom_marriage.jpg";

const albumCards = [
  { id: "dad-remembrance", title: "Dad Remembrance", image: cardDadRemembrance },
  { id: "mum-remembrance", title: "Mum Remembrance", image: cardMumRemembrance },
  { id: "twins-birth", title: "Twins Birth", image: cardTwinsBirth },
  { id: "wife-birthday", title: "My Wife Birthday", image: cardWifeBirthday },
  { id: "clara-bday", title: "Clara Bday", image: cardClaraBday },
  { id: "tom-marriage", title: "Tom Marriage", image: cardTomMarriage },
];

export default function PhotoAlbums() {
  return <PhoneLayout cards={albumCards} />;
}
