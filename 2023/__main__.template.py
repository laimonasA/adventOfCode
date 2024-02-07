def run():
  file = open("./input.ex.txt")
  # file = open("./input.txt")
  data = file.read().split("\n")
  file.close()

  data = data[:-1]

  print(data)

  total1 = 0

  # Code here

  total2 = 0

  # Code here

  print("Part 1 total:", total1)
  print("Part 2 total:", total2)

run()
