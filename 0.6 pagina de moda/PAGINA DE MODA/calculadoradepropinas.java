import java.util.Scanner;

public class calculadoradepropinas {
    public static void main(String[] args) {



        //Valor total de la cuenta
        Scanner valor = new Scanner(System.in);
        System.out.print("Ingresa el valor total de tu cuenta: ");
        int valorTotal = valor.nextInt();

        // Nivel satisfaccion 
        Scanner satisfaccion = new Scanner(System.in);
        System.out.println("selecciona tu nivel de satisfaccon:");
        System.out.print("1. Malo\n 2. Aceptable\n 3. Exelente\n");
        int nivelSatisfaccion = valor.nextInt();


        //Tipo de cliente 
        Scanner cliente = new Scanner(System.in);
        System.out.println("selecciona el tipo de cliente:");
        System.out.print("1. Regular\n 2. Frecuente\n 3. VIP\n");
        int tipoCliente = valor.nextInt();

        System.out.println("El valor total de la cuenta sin descuentos y propina: " + valorTotal);

        int valorPropina = 0;

        //Condicional de satisfaccion
        if(nivelSatisfaccion == 1) {
            valorPropina = (valorTotal * 0) / 100;
            System.out.println("no hay propina");
            System.out.println("El valor a pagar es " + valorTotal);
        }   else if (nivelSatisfaccion == 2){
            System.out.println("10% de propina");

            valorPropina = (valorTotal * 10) / 100;
            System.out.println("El valor total con la propina es: " + (valorTotal + valorPropina));
            

        } else if (nivelSatisfaccion == 3) {
            System.out.println("15% de propina");

            valorPropina = (valorTotal * 15) / 100;
            System.out.println("El valor total con la propina es: " + (valorTotal + valorPropina));
        } 
        
        else {
            System.out.println("Nivel de satisfaccion no valido");
        }



        //Extras segun el tipo de cliente
        if(tipoCliente == 2){

            if(nivelSatisfaccion == 2 || nivelSatisfaccion == 3) {
            System.out.println("El cliente tiene un descuento del 5% por ser cliente frecuente");
            int descuentoFinal = (valorPropina + valorTotal) * 5 / 100;
                
            int totalPagar = valorPropina + valorTotal - descuentoFinal;

            System.out.println("El total a pagar es: " + totalPagar);    
            }


        } else if(tipoCliente == 3){
            if(nivelSatisfaccion == 3) {
            System.out.println("El cliente tiene un descuento del 10% por ser cliente frecuente");
            int descuentoFinal = (valorPropina + valorTotal) * 10 / 100;
                
            int totalPagar =  valorPropina + valorTotal - descuentoFinal;

            System.out.println("El total a pagar es: " + totalPagar);
        } else if (tipoCliente == 3) {
            if (nivelSatisfaccion == 1) {
            System.out.println("Lamentamos no haber cumplido con sus expectativas");
        }
    }

}
} 
}
