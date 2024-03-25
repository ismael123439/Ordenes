print("introduceme tu nombre");
nombre = input("");

print("introduceme tu edad");
edad = int(input(""));

print("introduceme tu ciudad de residencia");
direccion = input("");
año = 2024

def calcaño (edad):
    años_restantes = año - edad
    print("Sos del año:", años_restantes)

    if edad >= 18:
        print("son legal");
    print("no sos legal");

    if edad % 5 == 0:
        print("tu edad es multiplo de 5!!!!!!!!!");
    print("tu edad no es multiplo de 5!!!!!!!!!");
   
print("hola ", nombre,"tienes: ", edad, "y sos de ", direccion);

calcaño(edad)