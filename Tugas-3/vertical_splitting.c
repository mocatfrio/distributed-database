#include <stdio.h>

int bond(int x, int y, int jml_atribut, int	(*matrix)[jml_atribut+1], int index);
int cont(int atribut_1, int atribut_2, int atribut_3, int jml_atribut, int (*matrix)[jml_atribut+1], int index);


int main() {
	int jml_atribut, 
		index = 3,
		baris, 
		kolom, 
		max_cont = 0, 
		iterasi = 1, 
		loc, 
		temp_cont;

	printf("Masukkan jumlah atribut: \n");
	scanf("%d", &jml_atribut); //nilai n

	int clustered_affinity_matrix[jml_atribut+1][jml_atribut+1], 
		attribute_affinity_matrix[jml_atribut+1][jml_atribut+1];

	
	//ngisi index A
	attribute_affinity_matrix[0][0] = 0;
	for(baris = 1; baris <= jml_atribut; baris++) {
		attribute_affinity_matrix[baris][0] = baris;
		
	}

	for(kolom = 1; kolom <= jml_atribut; kolom++) {
		attribute_affinity_matrix[0][kolom] = kolom;
		
	}
	printf("\nMasukkan Affinity Attribute Matrix: \n");
	for(baris = 1; baris <= jml_atribut; baris++) 
	{
		for(kolom = 1; kolom <= jml_atribut; kolom++) 
		{
			scanf("%d", &attribute_affinity_matrix[baris][kolom]);
		}
	}
	printf("\n");

	printf("-------------------------------------------------------------------------------\n");
	printf("Affinity Attribute Matrix\n");
	printf("-------------------------------------------------------------------------------\n");

	for(baris = 0; baris <= jml_atribut; baris++) 
	{
		for(kolom = 0; kolom <= jml_atribut; kolom++) 
		{
			if (baris == 0 || kolom == 0)
			{
				printf("| A%d	|", attribute_affinity_matrix[baris][kolom]);
			} else {
				printf("| %d	|", attribute_affinity_matrix[baris][kolom]);
			}
		}
		printf("\n");
	}
	printf("\n");

	//Inisialisasi
	for(baris = 0; baris <= jml_atribut; baris++) 
	{
		for(kolom = 0; kolom <= jml_atribut; kolom++) 
		{
			clustered_affinity_matrix[baris][kolom] = attribute_affinity_matrix[baris][kolom];
		}
	}

	printf("-------------------------------------------------------------------------------\n");
	printf("Tahap 1: Inisialisasi - Memilih A1 dan A2\n");
	printf("-------------------------------------------------------------------------------\n");

	for(baris = 0; baris <= jml_atribut; baris++) 
	{
		for(kolom = 0; kolom <= 2; kolom++) 
		{
			if (baris == 0 || kolom == 0)
			{
				printf("| A%d	|", clustered_affinity_matrix[baris][kolom]);
			} else {
				printf("| %d	|", clustered_affinity_matrix[baris][kolom]);
			}
		}
		printf("\n");
	}
	printf("\n");

	printf("-------------------------------------------------------------------------------\n");
	printf("Tahap 2: Iterasi - Memilih lokasi terbaik untuk A-index (Mengurutkan Kolom)\n");
	printf("-------------------------------------------------------------------------------\n");

	for (int index_now = index; index_now <= jml_atribut; index_now++)
	{
		// reset max_cont
		max_cont = 0;
		
		printf("-------------------------------------------------------------------------------\n");
		printf("Iterasi %d (menempatkan A%d)\n", iterasi, index_now);
		printf("-------------------------------------------------------------------------------\n");
		
		for (int i = 1; i < index_now; i++)
		{			
			temp_cont = cont(i-1, index_now, i, jml_atribut, clustered_affinity_matrix, index_now);

			if (temp_cont >= max_cont) {
				max_cont = temp_cont;
				loc = i;
			}
		}
		temp_cont = cont(index_now-1, index_now, index_now+1, jml_atribut, clustered_affinity_matrix, index_now);

		if (temp_cont >= max_cont) {
			max_cont = temp_cont;
			loc = index_now;
		}

		printf("-------------------------------------------------------------------------------\n");
		printf("Kontribusi Maksimum = %d --> loc = %d\n", max_cont, loc);
		printf("-------------------------------------------------------------------------------\n");

		//shuffle two matrices
		for (int j = index_now; j > loc; j--)
		{
			for (baris = 0; baris <= jml_atribut; baris++)
			{
				clustered_affinity_matrix[baris][j] = clustered_affinity_matrix[baris][j-1];
			}
		}
		for (baris = 0; baris <= jml_atribut; baris++)
		{
			clustered_affinity_matrix[baris][loc] = attribute_affinity_matrix[baris][index_now];
		}

		//test print
		for(baris = 0; baris <= jml_atribut; baris++) 
		{
			for(kolom = 0; kolom <= index_now; kolom++) 
			{
				if (baris == 0 || kolom == 0)
				{
					printf("| A%d	|", clustered_affinity_matrix[baris][kolom]);
				} else {
					printf("| %d	|", clustered_affinity_matrix[baris][kolom]);
				}
			}
			printf("\n");
		}
		printf("\n");

		iterasi++;
	}

	//ordering row



	printf("-------------------------------------------------------------------------------\n");
	printf("Hasil akhir Clustered Affinity Matrix tanpa pengurutan row\n");
	printf("-------------------------------------------------------------------------------\n");
	for(baris = 0; baris <= jml_atribut; baris++) 
	{
		for(kolom = 0; kolom <= jml_atribut; kolom++) 
		{
			if (baris == 0 || kolom == 0)
			{
				printf("| A%d	|", clustered_affinity_matrix[baris][kolom]);
			} else {
				printf("| %d	|", clustered_affinity_matrix[baris][kolom]);
			}
		}
		printf("\n");
	}
	printf("\n");

	return 0;
}

int bond(int x, int y, int jml_atribut, int (*matrix)[jml_atribut+1], int index) {
	int hasil = 0;

	for (int z = 1; z <= jml_atribut; z++)
	{
		if(x == 0 || y > jml_atribut || y > index) 
		{
			hasil += 0;
		} else {
			printf("----- aff[%d][%d] = %d\n", z, x, matrix[z][x]);
			printf("----- aff[%d][%d] = %d\n", z, y, matrix[z][y]);
			printf("----- aff[%d][%d] . aff[%d][%d] = %d\n", z, y, z, y, matrix[z][x]*matrix[z][y]);
			hasil += matrix[z][x] * matrix[z][y];
		}
	}

	return hasil;
}

int cont(int atribut_1, int atribut_2, int atribut_3, int jml_atribut, int (*matrix)[jml_atribut+1], int index) {
	int bond_1, bond_2, bond_3, hasil;

	bond_1 = bond(atribut_1, atribut_2, jml_atribut, matrix, index);
	printf("-- bond(A%d, A%d) = %d\n\n", atribut_1, atribut_2, bond_1);

	bond_2 = bond(atribut_2, atribut_3, jml_atribut, matrix, index);
	printf("-- bond(A%d, A%d) = %d\n\n", atribut_2, atribut_3, bond_2);

	bond_3 = bond(atribut_1, atribut_3, jml_atribut, matrix, index);
	printf("-- bond(A%d, A%d) = %d\n\n", atribut_1, atribut_3, bond_3);

	hasil = (2 * bond_1) + (2 * bond_2) - (2 * bond_3);
	printf("cont(A%d, A%d, A%d) = %d\n\n", atribut_1, atribut_2, atribut_3, hasil);

	return hasil;
}