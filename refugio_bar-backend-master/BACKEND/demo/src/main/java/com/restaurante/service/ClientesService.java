package com.restaurante.service;

import java.util.List;
import java.util.Optional;

import com.restaurante.model.Cliente;

public interface ClientesService {
	List<Cliente> getAllClientes();
	Optional<Cliente> getClienteById(Long id);
	Cliente createCliente(Cliente cliente);
	Optional<Cliente> updateCliente(Long id, Cliente clienteDetails);
	boolean deleteCliente(Long id);
}
