export interface Motorcycle {
  make: string;
  model: string;
  year: number;
  type: string;
  displacement: string;
  engine: string;
  power: string;
  torque: string;
  compression: string;
  bore_stroke: string;
  fuel_system: string;
  fuel_capacity: string;
  transmission: string;
  frame: string;
  wheelbase: string;
  dimensions: string;
  seat_height: string;
  weight: string;
  starter: string;
}

export interface FavoriteMotorcycle extends Motorcycle {
  id: string;
  userId: string;
  createdAt: Date;
}
