CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  assignment VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  vehicleOwner VARCHAR(255) NOT NULL,
  vehicleRegNo VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL
);

-- Insert sample data
INSERT INTO appointments (assignment, branch, vehicleOwner, vehicleRegNo, status, date, time) VALUES
('Ölwechsel', 'Berlin', 'Max Mustermann', 'B-AB 1234', 'Reparatur', '2024-10-01', '10:30'),
('Reifenwechsel', 'Dortmund', 'Laura Schmidt', 'M-XY 5678', 'Reparatur', '2024-10-05', '14:00'),
('Inspektion', 'Berlin', 'Peter Meyer', 'C-DK 9101', 'Reparatur', '2024-09-30', '09:00');
