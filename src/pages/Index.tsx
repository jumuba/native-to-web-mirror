import PhoneLayout from "@/components/PhoneLayout";
import cardBirthdays from "@/assets/card_birthdays.png";
import cardBirthRobert from "@/assets/card_birth_robert.png";
import cardFamily from "@/assets/card_family.png";
import cardFriends from "@/assets/card_friends.png";
import cardHolidays from "@/assets/card_holidays.png";
import cardChristmas from "@/assets/card_christmas.png";

const albumCards = [
  { id: "birthdays", title: "Birthdays", image: cardBirthdays },
  { id: "birth-robert", title: "Birth of Robert", image: cardBirthRobert },
  { id: "family", title: "Family", image: cardFamily },
  { id: "friends", title: "Friends", image: cardFriends },
  { id: "holidays", title: "Holidays", image: cardHolidays },
  { id: "christmas", title: "Christmas", image: cardChristmas },
];

export default function Index() {
  return <PhoneLayout cards={albumCards} />;
}
