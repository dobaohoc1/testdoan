// Dữ liệu mẫu cho demo ứng dụng dinh dưỡng

export interface UserProfile {
  hoTen: string;
  tuoi: number;
  chieuCao: number;
  canNang: number;
  gioiTinh: string;
  mucDoHoatDong: string;
  mucTieu: string;
  dinhDuong: string;
  timBenhLy: string;
  thucPhamKhongThich: string;
}

export interface Meal {
  ten: string;
  moTa: string;
  calo: number;
  protein: number;
  carb: number;
  fat: number;
  thoiGianNau: number;
  khauPhan: number;
  congThuc: string[];
  nguyenLieu: string[];
}

export interface MealPlan {
  sang: Meal;
  trua: Meal;
  toi: Meal;
  anVat: Meal;
}

// Hàm tính toán calo cơ bản theo BMR và mức độ hoạt động
export const tinhCaloCoBan = (profile: UserProfile): number => {
  let bmr: number;
  
  // Tính BMR theo công thức Mifflin-St Jeor
  if (profile.gioiTinh === "nam") {
    bmr = 10 * profile.canNang + 6.25 * profile.chieuCao - 5 * profile.tuoi + 5;
  } else {
    bmr = 10 * profile.canNang + 6.25 * profile.chieuCao - 5 * profile.tuoi - 161;
  }

  // Nhân với hệ số hoạt động
  const heSoHoatDong: { [key: string]: number } = {
    "it": 1.2,
    "nhe": 1.375,
    "vua": 1.55,
    "cao": 1.725,
    "ratCao": 1.9
  };

  const tdee = bmr * (heSoHoatDong[profile.mucDoHoatDong] || 1.2);

  // Điều chỉnh theo mục tiêu
  switch (profile.mucTieu) {
    case "giamCan":
      return Math.round(tdee - 500); // Giảm 500 cal/ngày
    case "tangCan":
      return Math.round(tdee + 300); // Tăng 300 cal/ngày
    case "tangCoBap":
      return Math.round(tdee + 200); // Tăng nhẹ + protein cao
    default:
      return Math.round(tdee); // Duy trì
  }
};

// Dữ liệu mẫu thực đơn dựa trên mục tiêu
export const taoThucDonMau = (profile: UserProfile): { mealPlan: MealPlan; tongCalo: number } => {
  const tongCalo = tinhCaloCoBan(profile);
  const caloSang = Math.round(tongCalo * 0.25);
  const caloTrua = Math.round(tongCalo * 0.35);
  const caloToi = Math.round(tongCalo * 0.3);
  const caloAnVat = Math.round(tongCalo * 0.1);

  let mealPlan: MealPlan;

  if (profile.mucTieu === "giamCan") {
    mealPlan = {
      sang: {
        ten: "Yến mạch trái cây giảm cân",
        moTa: "Yến mạch với sữa tách béo, quả việt quất và hạt chia giàu chất xơ",
        calo: caloSang,
        protein: 15,
        carb: 45,
        fat: 8,
        thoiGianNau: 10,
        khauPhan: 1,
        nguyenLieu: [
          "50g yến mạch",
          "200ml sữa tách béo",
          "50g quả việt quất",
          "1 thìa hạt chia",
          "1 thìa mật ong"
        ],
        congThuc: [
          "Nấu yến mạch với sữa trong 5 phút",
          "Thêm hạt chia và khuấy đều",
          "Trang trí với quả việt quất",
          "Thêm mật ong và thưởng thức"
        ]
      },
      trua: {
        ten: "Salad gà nướng quinoa",
        moTa: "Salad xanh với gà nướng, quinoa và sốt dầu olive chanh",
        calo: caloTrua,
        protein: 35,
        carb: 30,
        fat: 12,
        thoiGianNau: 25,
        khauPhan: 1,
        nguyenLieu: [
          "150g ức gà",
          "50g quinoa khô",
          "100g rau xà lách",
          "50g cà chua cherry",
          "30g dưa chuột",
          "1 thìa dầu olive",
          "Nước cốt chanh"
        ],
        congThuc: [
          "Nướng ức gà với gia vị 15 phút",
          "Nấu quinoa theo hướng dẫn",
          "Cắt rau củ thành miếng vừa ăn",
          "Trộn tất cả với sốt dầu olive chanh"
        ]
      },
      toi: {
        ten: "Cá hồi nướng với rau củ",
        moTa: "Cá hồi nướng giàu omega-3 với rau củ nướng đầy màu sắc",
        calo: caloToi,
        protein: 30,
        carb: 25,
        fat: 15,
        thoiGianNau: 30,
        khauPhan: 1,
        nguyenLieu: [
          "120g phi lê cá hồi",
          "100g bông cải xanh",
          "80g cà rót",
          "60g ớt chuông",
          "1 thìa dầu olive",
          "Muối, tiêu, thảo mộc"
        ],
        congThuc: [
          "Tẩm ướp cá hồi với gia vị",
          "Cắt rau củ thành miếng vừa ăn",
          "Nướng cá và rau trong lò 20 phút",
          "Bày trí đẹp mắt và thưởng thức"
        ]
      },
      anVat: {
        ten: "Sữa chua Hy Lạp với hạt",
        moTa: "Sữa chua Hy Lạp protein cao với hạnh nhân và quả mọng",
        calo: caloAnVat,
        protein: 12,
        carb: 8,
        fat: 6,
        thoiGianNau: 5,
        khauPhan: 1,
        nguyenLieu: [
          "100g sữa chua Hy Lạp",
          "15g hạnh nhân",
          "30g quả mọng tươi",
          "1/2 thìa mật ong"
        ],
        congThuc: [
          "Cho sữa chua vào bát",
          "Rắc hạnh nhân lên trên",
          "Thêm quả mọng tươi",
          "Rưới mật ong và thưởng thức"
        ]
      }
    };
  } else if (profile.mucTieu === "tangCan" || profile.mucTieu === "tangCoBap") {
    mealPlan = {
      sang: {
        ten: "Bánh mì alpaca với trứng",
        moTa: "Bánh mì nguyên cám với trứng chiên, alpaca và rau củ bổ dưỡng",
        calo: caloSang,
        protein: 20,
        carb: 55,
        fat: 15,
        thoiGianNau: 15,
        khauPhan: 1,
        nguyenLieu: [
          "2 lát bánh mì nguyên cám",
          "2 quả trứng",
          "50g alpaca",
          "1/2 quả cà chua",
          "Rau xà lách",
          "1 thìa dầu olive"
        ],
        congThuc: [
          "Nướng bánh mì đến giòn",
          "Chiên trứng với dầu olive",
          "Cắt alpaca và cà chua lát mỏng",
          "Ghép thành sandwich và thưởng thức"
        ]
      },
      trua: {
        ten: "Cơm gạo lứt với thịt bò xào",
        moTa: "Cơm gạo lứt giàu chất xơ với thịt bò xào rau củ đầy đủ dinh dưỡng",
        calo: caloTrua,
        protein: 40,
        carb: 65,
        fat: 18,
        thoiGianNau: 35,
        khauPhan: 1,
        nguyenLieu: [
          "80g gạo lứt",
          "150g thịt bò thăn",
          "100g bông cải xanh",
          "50g cà rót",
          "50g ớt chuông",
          "2 thìa dầu ăn",
          "Gia vị Việt Nam"
        ],
        congThuc: [
          "Nấu cơm gạo lứt",
          "Cắt thịt bò thành miếng vừa ăn",
          "Xào thịt bò với rau củ",
          "Nêm nếm vừa ăn và ăn kèm cơm"
        ]
      },
      toi: {
        ten: "Mì pasta với sốt kem nấm",
        moTa: "Mì pasta nguyên cám với sốt kem nấm thơm ngon, giàu protein",
        calo: caloToi,
        protein: 25,
        carb: 50,
        fat: 20,
        thoiGianNau: 25,
        khauPhan: 1,
        nguyenLieu: [
          "100g mì pasta nguyên cám",
          "150g nấm tươi",
          "100ml kem tươi",
          "50g phô mai parmesan",
          "2 tép tỏi",
          "Rau húng quế"
        ],
        congThuc: [
          "Luộc mì pasta theo hướng dẫn",
          "Xào nấm với tỏi thơm",
          "Thêm kem tươi và phô mai",
          "Trộn với mì và rắc húng quế"
        ]
      },
      anVat: {
        ten: "Sinh tố chuối protein",
        moTa: "Sinh tố chuối với sữa, bơ đậu phộng và protein bột bổ dưỡng",
        calo: caloAnVat,
        protein: 15,
        carb: 25,
        fat: 8,
        thoiGianNau: 5,
        khauPhan: 1,
        nguyenLieu: [
          "1 quả chuối chín",
          "200ml sữa tươi",
          "1 thìa bơ đậu phộng",
          "1 thìa protein bột",
          "Ít đá viên"
        ],
        congThuc: [
          "Cho tất cả nguyên liệu vào máy xay",
          "Xay nhuyễn trong 1 phút",
          "Rót vào ly cao",
          "Thưởng thức ngay khi còn mát"
        ]
      }
    };
  } else {
    // Mục tiêu duy trì cân nặng
    mealPlan = {
      sang: {
        ten: "Phở gà truyền thống",
        moTa: "Phở gà Việt Nam truyền thống với bánh phở gạo và thịt gà thơm ngon",
        calo: caloSang,
        protein: 25,
        carb: 50,
        fat: 10,
        thoiGianNau: 20,
        khauPhan: 1,
        nguyenLieu: [
          "100g bánh phở tươi",
          "100g thịt gà luộc",
          "500ml nước dùng gà",
          "Hành lá, ngò rí",
          "Giá đỗ, chanh, ớt"
        ],
        congThuc: [
          "Đun nóng nước dùng gà",
          "Chần bánh phở trong nước sôi",
          "Bày bánh phở và thịt gà vào t그릇",
          "Rót nước dùng nóng và thêm rau thơm"
        ]
      },
      trua: {
        ten: "Cơm tấm sườn nướng",
        moTa: "Cơm tấm Sài Gòn với sườn nướng thơm lừng và chả trứng",
        calo: caloTrua,
        protein: 30,
        carb: 55,
        fat: 15,
        thoiGianNau: 30,
        khauPhan: 1,
        nguyenLieu: [
          "100g gạo tấm",
          "150g sườn heo",
          "1 quả trứng",
          "Dưa chua, cà chua",
          "Nước mắm pha"
        ],
        congThuc: [
          "Nấu cơm tấm mềm dẻo",
          "Nướng sườn với nước mắm pha",
          "Chiên chả trứng mỏng",
          "Bày cơm với topping và ăn kèm dưa chua"
        ]
      },
      toi: {
        ten: "Canh chua cá lóc",
        moTa: "Canh chua cá lóc miền Tây với dứa, cà chua và rau thơm",
        calo: caloToi,
        protein: 28,
        carb: 20,
        fat: 8,
        thoiGianNau: 25,
        khauPhan: 1,
        nguyenLieu: [
          "200g cá lóc phi lê",
          "100g dứa",
          "50g cà chua",
          "Rau thơm miền Tây",
          "Me, đường phèn"
        ],
        congThuc: [
          "Nấu nước dùng từ xương cá",
          "Thêm me, đường tạo vị chua ngọt",
          "Cho dứa, cà chua vào nấu",
          "Thêm cá lóc và rau thơm cuối cùng"
        ]
      },
      anVat: {
        ten: "Chè đậu xanh",
        moTa: "Chè đậu xanh truyền thống với nước cốt dừa thơm béo",
        calo: caloAnVat,
        protein: 8,
        carb: 30,
        fat: 5,
        thoiGianNau: 45,
        khauPhan: 1,
        nguyenLieu: [
          "100g đậu xanh",
          "50ml nước cốt dừa",
          "Đường phèn",
          "Muối",
          "Lá dứa"
        ],
        congThuc: [
          "Nấu đậu xanh mềm với lá dứa",
          "Thêm đường phèn vừa ngọt",
          "Nấu đến khi sánh mịn",
          "Ăn nóng với nước cốt dừa"
        ]
      }
    };
  }

  return { mealPlan, tongCalo };
};