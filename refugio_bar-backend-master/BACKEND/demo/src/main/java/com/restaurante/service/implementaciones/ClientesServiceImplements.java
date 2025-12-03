package com.restaurante.service.implementaciones;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurante.model.Cliente;
import com.restaurante.repository.ClienteRepository;
import com.restaurante.service.ClientesService;

@Service
public class ClientesServiceImplements implements ClientesService {

	@Autowired
	private ClienteRepository clienteRepository;


	@Override
	public List<Cliente> getAllClientes() {
		return clienteRepository.findAll();
	}


	@Override
	public Optional<Cliente> getClienteById(Long id) {
		return clienteRepository.findById(id);
	}


	@Override
	public Cliente createCliente(Cliente cliente) {
		return clienteRepository.save(cliente);
	}


	@Override
	public Optional<Cliente> updateCliente(Long id, Cliente clienteDetails) {
		return clienteRepository.findById(id).map(cliente -> {
			cliente.setNombre(clienteDetails.getNombre());
			cliente.setApellido(clienteDetails.getApellido());
			cliente.setEmail(clienteDetails.getEmail());
			cliente.setTelefono(clienteDetails.getTelefono());
			cliente.setActivo(clienteDetails.getActivo() != null ? clienteDetails.getActivo() : true);
			return clienteRepository.save(cliente);
		});
	}

	@Override
	public boolean deleteCliente(Long id) {
		if (clienteRepository.existsById(id)) {
			clienteRepository.deleteById(id);
			return true;
		}
		return false;
	}
}
